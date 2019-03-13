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
    const filehound = FileHound.create();
    const images = filehound
        .path(program.imagepath)
        .ext(extensionsArray)
        .findSync();
    const zipFileName = 'images.zip';
    const zip = new AdmZip();
    const uploadType = program.uploadtype || uploadTypes.general;

    images.forEach(file => {
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
                    console.log(`Sending media to ${item}`);
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
        .parse(argv);

    //set defaults
    start(program);
};


