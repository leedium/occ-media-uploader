/*
 * Copyright (c) 2019 LEEDIUM.
 * This file is subject to the terms and conditions
 * defined in file 'LICENSE.txt', which is part of this
 * source code package.
 */

/**
 * @project occ-media-uploader
 * @file app.js
 * @company LEEDIUM
 * @createdBy leedium
 * @contact support@leedium.com
 * @dateCreated 2019-03-06
 * @description Main entry file for application
 */

const FileHound = require('filehound');
const AdmZip = require('adm-zip');
const program = require('commander');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');

const zipFileName = "images.zip"
const resObj = require('./restObj');
const packageJSON = require('../package');
const extensionsArray = ['.jpg', '.png', '.gif', 'svg', '.tiff', '.tif'];
const uploadTypes = {
    productImage: "productImage",
    general: "general",
    collectionImage: "collectionImage"
};

const apiFilesEndpoint = '/ccadmin/v1/files';
const list = val => val.split(',');

/**
 * Starts the transfer to all environments listed
 * @param program
 * @returns {Promise<void>}
 */
const start = async (program) => {
    try {
        const filehound = FileHound.create();
        const zipFileName = 'images.zip';
        const zip = new AdmZip();
        const uploadType = program.uploadtype || uploadTypes.general;
        let images;
        let imgPath = program.imagepath;
        if (typeof program.optimize !== 'undefined') {
            console.log('optimizing images');
            imgPath = 'build';
            if (program.optimize < 1 && program.optimize > 0) {
                const files = await imagemin(['./images/**/*.{jpg,png,gif}'], './build/images', {
                    plugins: [
                        imageminMozjpeg({quality: program.optimize * 100}),
                        imageminPngquant({
                            quality: [program.optimize, program.optimize]
                        }),
                        imageminGifsicle()
                    ]
                });
                // console.log('optimization complete')
            } else {
                throw new Error("quality must be between 0 and 1")
            }
        }
        images = filehound
            .path(imgPath)
            .ext(extensionsArray)
            .findSync();

        images.forEach(file => {
            // console.log(file)
            zip.addLocalFile(file);
        });

        zip.toBuffer(async (successBuffer) => {
                try {
                    const buffer64 = Buffer.from(successBuffer).toString('base64')
                    const tokens = await Promise.all(program.servers.map((item, i) => {
                        return resObj.apiCall(
                            item,
                            program.keys[i],
                            'PUT',
                            apiFilesEndpoint, {
                                filename: zipFileName,
                                segments: 1,
                                uploadtype: uploadType
                            })
                    }));
                    await Promise.all(program.servers.map((item, i) => {
                        // console.log(`Sending media to ${item}`);
                        return resObj.apiCall(
                            item,
                            program.keys[i],
                            'POST',
                            `${apiFilesEndpoint}/${tokens[i].token}`, {
                                file: buffer64,
                                filename: zipFileName,
                                index: 0
                            });
                    }));
                    console.log(`Transfer to ${program.servers.length} environments complete.`)
                } catch (err) {
                    console.log(err.message);
                }
            },
            (err) => {
                console.log(err.message);
            });
    }catch (err) {
        console.log(`Error: ${err.message}`)
    }
};

// main entry function
exports.main = function (argv) {
    program
        .version(packageJSON.version)
        .description(
            `Tool to transfer images across mutiple OCC instances\n `
        )
        .usage(
            "omu -s [servers] -t [keys] -d [imagePath] -u [uploadtype]",
            ""
        )
        //
        .option(
            "-s, --servers <items>",
            "Comma delimited string with the server definitions ie: server1,server2,serverN",
            list
        )
        .option(
            "-t, --keys <items>",
            "Occ Admin api key for server ie: key1,key2,key3",
            list
        )
        .option(
            "-d, --imagepath <imagepath>",
            "path to folder to generate the image zipfile"
        )
        .option(
            "-u, --uploadtype <uploadtype>",
            "Upload Type < productImage, collectionImage, general >"
        )
        .option(
            "-v, --optimize <n>",
            "optimizes images before packaging, (0 - 1)",
            parseFloat
        )
        .parse(argv);

    //set defaults
    start(program);
};


