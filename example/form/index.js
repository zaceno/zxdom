import {h, update, define, mount} from '../../src'

const Radios =({name, data, options, set}) => (
    <ul>
        {options.map(v => (
            <li>
                <input
                    type="radio"
                    name={name}
                    checked={v === data[name]}
                    value={v}
                    onchange={ev => set(name, v)}
                />
                {v}
            </li>
        ))}
    </ul>
)

const DropDown = ({name, data, options, set}) => (
    <select disabled={!options} name={name} oninput={ev => set(name, ev.target.value)}>
        <option disabled selected={!data[name]} value="">Select:</option>
        {options && options.map(o=>(
            <option selected={data[name]===o}>{o}</option>
        ))}
    </select>
)

const TextInput = ({name, data, set}) => (
    <input
        type="text"
        name={name}
        value={data[name]}
        oninput={ev => set(name, ev.target.value)}
    />
)

const Slider = ({name, min=0, max=20, data, set}) => (
    <label>
        {name}:
        <input
            type="range"
            min={min}
            max={max}
            value={data[name]}
            name={name}
            oninput={ev => set(name, ev.target.value)}
        />
        {data[name]}
    </label>
)

const ABILITY_POINTS = 30

const RACES = [
    'Mermaid',
    'Centaur',
    'Sasquatch',
]

const CLASSES = {
    Mermaid: [
        'Siren',
        'Shark-bait',
        'Sea-witch'
    ],
    Centaur: [
        'Hunter',
        'Farmer',
        'UX-designer',
    ],
    Sasquatch: [
        'Joker',
        'Smoker',
        'Midnight toker'
    ]
}

const ABILITIES = {
    Mermaid: {
        Strength:  {min: 0,  max: 5},
        Dexterity: {min: 5,  max: 10},
        Brains:    {min: 0,  max: 15},
        Looks:     {min: 10, max: 20},
    },
    Centaur: {
        Strength: {min: 5, max: 15},
        Dexterity: {min: 0, max: 10},
        Looks: {min: 5, max: 10},
        Brains: {min: 5, max: 15},
    },
    Sasquatch: {
        Strength: {min: 10, max: 20},
        Dexterity: {min: 5, max: 20},
        Looks: {min: 0, max: 5},
        Brains: {min: 0, max: 5},
    }
}


function pointsRemaining () {
    return (
        ABILITY_POINTS
        - data.Strength
        - data.Dexterity
        - data.Looks
        - data.Brains
    )
}

function set(name, value) {
    if (name === 'race' && value !== data.race) {
        data.race = value
        data.class = null;
    } else {
        let oldremain = pointsRemaining()
        let oldvalue = data[name]
        data[name] = value
        if (pointsRemaining() < 0 && oldremain >= 0) {
            data[name] = oldvalue
        }
    }
    if(data.race) {
            ['Strength', 'Dexterity', 'Looks', 'Brains'].forEach(ability => {
            const {min, max} = ABILITIES[data.race][ability]
            data[ability] = Math.max(min, Math.min(max, data[ability]))
        })
    }
    update(Form)
}

function onsubmit () {
    errors = []
    if (!data.name) errors.push('A Name is required')
    if (!data.race) errors.push('A Race is required')
    if (!data.class) errors.push('A Class is required')
    const remaining = pointsRemaining()
    if (remaining > 0 ) errors.push('You must spend all ability points')
    if (remaining < 0 ) errors.push('You have spent too many ability points')
    if (!errors.length) reset()
    update(Form)
}

const Form = define(_ => (
    <form name="sheet" onsubmit={ev => {
            ev.preventDefault(true)
            onsubmit()
        }}>
        {errors.length ? (
        <ul style="color:red;">
            {errors.map(e => <li>{e}</li>)}   
        </ul>
        ): null}
        <h3>Name:</h3>
        <TextInput name="name" data={data} set={set}/>
        <h3>Race:</h3>
        <Radios name="race" options={RACES} data={data} set={set} />
        <h3>Class:</h3>
        <DropDown name="class" options={CLASSES[data.race]} data={data} set={set}/>
        <h3>Abilities</h3>
        <p>Remaining points: <b>{pointsRemaining()}</b></p>
        <p><Slider name="Strength"  set={set} data={data} /></p>
        <p><Slider name="Dexterity" set={set} data={data} /></p>
        <p><Slider name="Brains"    set={set} data={data} /></p>
        <p><Slider name="Looks"     set={set} data={data} /></p>

        <input type="submit" value="Submit"/>
   </form>
))

function reset () {
    data = {
        name: null,
        race: null,
        class: null,
        Strength: 0,
        Dexterity: 0,
        Brains: 0,
        Looks: 0,
    }
    errors = []
}
var data = {}
var errors = []
reset()


export const view = _ => (
    <section>
        <h2>Character Sheet</h2>
        <Form />
    </section>
)
