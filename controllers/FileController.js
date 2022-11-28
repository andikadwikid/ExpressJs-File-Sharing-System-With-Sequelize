let models = require('../models')
const bcrypt = require('bcrypt')
const File = models.File

exports.getIndex = (req, res, next) => {
    let fileLink = req.cookies['fileLink']
    res.clearCookie('fileLink')
    res.render('index', {
        fileLink: fileLink
    })
}

exports.postFile = async (req, res, next) => {
    try {
        const fileData = {
            path: req.file.path,
            originalName: req.file.originalname,
        }
        if (req.body.password) {
            fileData.password = await bcrypt.hash(req.body.password, 10)
        }
        console.log(fileData)
        if (!req.file) {
            return res.render('index', {
                error: 'Please select a file'
            })
        }

        const file = await File.create(fileData)

        res.cookie('fileLink', `${req.protocol}://${req.get('host')}/file/${file.id}`)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
}

exports.handleDownload = async (req, res, next) => {
    try {
        const file = await File.findByPk(req.params.id)
        console.log(file.path)
        if (!file) {
            return res.render('index', {
                error: 'File not found'
            })
        }

        if (file.password) {
            if (!req.body.password) {
                return res.render('password', {
                    error: 'Password is required'
                })
            }

            if (!(await bcrypt.compare(req.body.password, file.password))) {
                return res.render('password', {
                    error: 'Password is incorrect'
                })
            }
        }

        file.downloadCount++
        await file.save()

        res.download(file.path, file.originalName)
    } catch (err) {
        console.log(err)
    }
}