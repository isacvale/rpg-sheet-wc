const character = {
    Stats: {
        name: "Character's name",
        clan: "Character's clan",
        origin: "Character's origin",
        concept: "Character's concept",
        specializations: [
            'Specialization 1',
            'Specialization 2',
        ]
    },
    Skills: {
        Physical: {
            Craft: 0,
            Athletics: 2,
            Stealth: 1,
            Reflex: 1,
            Survival: 0
        },
        Mental: {
            Healing: 0,
            Discipline: 0,
            Lore: 0,
            Mysticism: 0,
            Perception: 0
        },
        Social: {
            Taming: 0,
            Streetwise: 0,
            Manipulation: 0,
            Perform: 0,
            Presence: 0,
        },
        Martial: {
            Fight: 1,
            Sword: 3,
            Polearm: 1,
            Impact: 0,
            Shot: 2
        }
    },
    Health: {
        body: {
            max: 8,
            current: 2
        },
        mind: {
            max: 6,
            current: 1
        }
    }
}

export default character