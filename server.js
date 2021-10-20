var express = require('express')
var fetch = require('isomorphic-fetch')
var app = express()

const FigmaAPIKey = '253177-1f4a41f3-f9cf-49bb-a651-d41124d86ee0'
const FigmaFileID = `CUB8VDeLeheB9my9R5Ha0G`

async function figmaFileFetch(fileId){
    let result = await fetch('https://api.figma.com/v1/files/' + fileId , {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    })

    let figmaFileStruct = await result.json()

    let colorStyles = figmaFileStruct.document.children
        .filter(child => child.type === 'CANVAS')[0].children
        .filter(child => child.type === 'RECTANGLE')
        .map(rectangle => {
            return {
                name: rectangle.name,
                color: rectangle.fills[0].color
            }
        })

    return colorStyles
}

app.use('/', async function (req, res, next) {
    let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
    res.send(JSON.stringify(result))
})


app.listen(3001, console.log("Holy shit, I'm a server and I am listening on port 3001"))