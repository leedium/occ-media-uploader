# occ-media-uploader
Tool to optimize, package, and deploy media to multiple OCC instances


#### Version v1.1.0

## Chnagelog

v1.1.0
- added image optimization
- updated readme

v1.0.0
- image zip
- image transfer
- uploadType option

## Installation
```$xslt
npm i -g
```

## Instructions

```
Usage: index -s [servers] -t [keys] -d [imagePath] -u [uploadtype]

Tool to transfer images across mutiple OCC instances
 
Options:
  -V, --version                  output the version number
  -s, --servers <items>          Comma delimited string with the server definitions ie: server1,server2,serverN
  -t, --keys <items>             Occ Admin api key for server ie: key1,key2,keyN
  -d, --imagepath <imagepath>    path to folder to generate the image zipfile
  -u, --uploadtype <uploadtype>  Upload Type < productImage, collectionImage, general >
  -v, --optimize <optimize>      Optimization setting (percentage between 0 and 1)
  -h, --help                     output usage information
  
```

#### Example for a general(non collection/product) image

```$xslt
omu --servers https://server1.oracleoutsourcing.com,https://server2.oracleoutsourcing.com 
     --keys  SERVER_1_KEY,SERVER_2_KEY 
     --imagepath images
     --uploadtype general
     --optimize 0.5
```


<br/><br/><br/>
### Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
