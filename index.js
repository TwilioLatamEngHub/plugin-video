/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()

app.use(serveStatic(path.join(__dirname, 'public')))

app.listen(7070)