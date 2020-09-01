import Stamp from '/node_modules/@dvo/stamp/lib/stamp.js'
import dados from '/dados.js'
import { runMethod } from '/utils.js'

const qs = selector => document.querySelector(selector)

// Load stats
qs('[data-alias="name"]')
    .dataset.value = dados.Stats.name
qs('[data-alias="origin"]')
    .dataset.value = dados.Stats.origin
qs('[data-alias="clan"]')
    .dataset.value = dados.Stats.clan
qs('[data-alias="concept"]')
    .dataset.value = dados.Stats.concept

// Load specializations
qs('[data-alias="specializations"]')
    .dataset.value = dados.Stats.specializations.join(', ')

// Load skills
const skillGroups = document.querySelectorAll('.skill-wrapper trait-group')

Array.from(skillGroups).forEach(group => {
    const skillType = group.getAttribute('data-skill-type')
    const skillTypeName = {
        physical: 'Physical',
        mental: 'Mental',
        social: 'Social',
        martial: 'Martial'
    }[skillType]
    const rawSkills = dados.Skills[skillTypeName]
    const skillList = Object.entries(rawSkills)
        .map(entry => ({ name: entry[0], value: entry[1] }))
    runMethod(group, 'loadTraitList', [skillList])
    group.dataset.title = skillTypeName
})

// Load heatlh
;(function LoadHealth () {
    const { body, mind } = dados.Health
    
    const healthBodyGroup =  qs('[data-health-type="body"]')
    runMethod(
        healthBodyGroup,
        'loadTraitSpend',
        ['Body', body.max, body.current, 'body']
    )
    
    const healthMindGroup =  qs('[data-health-type="mind"]')
    runMethod(
        healthMindGroup,
        'loadTraitSpend',
        ['Mind', mind.max, mind.current, 'mind']
    )
}())
