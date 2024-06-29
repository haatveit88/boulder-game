window.addEventListener('DOMContentLoaded', (event) => {
    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    const restrictionList = document.getElementById('restriction-list');
    const unlockButtonsContainer = document.getElementById('unlock-buttons');
    const unlockedList = document.getElementById('unlocked-list');

    const pathArray = window.location.pathname.split('/');
    const sessionId = pathArray[2];
    let state = pathArray[3];

    // Simple seed-based random number generator
    function mulberry32(a) {
        return function() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    // Seeded shuffle function
    function seededShuffle(array, seed) {
        const rng = mulberry32(seed);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Convert session UUID to a seed
    function uuidToSeed(uuid) {
        return uuid.split('-').reduce((acc, part) => acc + parseInt(part, 16), 0);
    }

    // Define abilities
    const abilities = [
        "Use Purple Holds",
        "Use Hooks",
        "Move Freely",
        "Use Green Holds"  // Add more abilities as needed
    ];

    // Shuffle abilities based on session UUID
    const seed = uuidToSeed(sessionId);
    const shuffledAbilities = seededShuffle(abilities.slice(), seed);

    // Display current restrictions based on the state
    const restrictions = [];
    const unlockedAbilities = [];
    for (let i = 0; i < state.length; i++) {
        if (state[i] === '0') {
            restrictions.push(shuffledAbilities[i]);
        } else {
            unlockedAbilities.push(shuffledAbilities[i]);
        }
    }

    if (restrictions.length > 0) {
        restrictionList.innerHTML = restrictions.map(r => `<li>${r}</li>`).join('');
    } else {
        restrictionList.innerHTML = "No restrictions, go crazy!";
    }

    // Add unlock buttons
    unlockButtonsContainer.innerHTML = '';
    for (let i = 0; i < state.length; i++) {
        if (state[i] === '0') {
            const button = document.createElement('button');
            button.innerText = `Unlock ${String.fromCharCode(65 + i)}`; // "Unlock A", "Unlock B", etc.
            button.addEventListener('click', () => {
                // Update state logic: flip the corresponding '0' to '1'
                let newState = state.split('').map((bit, index) => index === i && bit === '0' ? '1' : bit).join('');

                // Ensure the state has been updated
                console.log(`Old State: ${state}, New State: ${newState}`);

                // Redirect to the new URL with updated state
                window.location.href = `/game/${sessionId}/${newState}`;
            });
            unlockButtonsContainer.appendChild(button);
        }
    }

    // Display unlocked abilities
    unlockedList.innerHTML = unlockedAbilities.map(a => `<li>${a}</li>`).join('');
});
