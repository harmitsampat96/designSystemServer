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
                r: rgbToInt(rectangle.fills[0].color.r),
                g: rgbToInt(rectangle.fills[0].color.g),
                b: rgbToInt(rectangle.fills[0].color.b),
                color: rgbToHex(rgbToInt(rectangle.fills[0].color.r), rgbToInt(rectangle.fills[0].color.g), rgbToInt(rectangle.fills[0].color.b))
            }
        })

    return colorStyles
}

async function figmaTypeFetch(fileId){
    let result = await fetch('https://api.figma.com/v1/files/' + fileId , {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    })

    let figmaFileStruct = await result.json()

    let fontStyles = figmaFileStruct.document.children
        .filter(child => child.type === 'CANVAS')[1].children
        .filter(child => child.type === 'FRAME')[0].children
        .filter(child => child.type === 'TEXT')
        .map(text => {
            return {
                style: text.style.fontPostScriptName
            }
        })

    return fontStyles
}

function rgbToInt(int) { return Math.round(int * 255) }

function intToHex(int) { 
    let hex = Number(int).toString(16);
    if (hex.length < 2) { hex = "0" + hex; }
    return hex;
}

function rgbToHex(r,g,b) {
    const red = intToHex(r);
    const green = intToHex(g);
    const blue = intToHex(b);
    return "#"+red+green+blue;
}

app.use('/colors', async function (req, res, next) {
    let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
    res.send(result)
})

app.use('/typography', async function (req, res, next) {
    let result = await figmaTypeFetch(FigmaFileID).catch(error => console.log(error))
    res.send(result)
})

app.listen(3001, console.log("Holy shit, I'm a server and I am listening on port 3001"))