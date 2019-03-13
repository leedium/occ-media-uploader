# occ-media-uploader
Tool to optimize, package, and deploy media to multiple OCC instances

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
  -h, --help                     output usage information
```

#### Example

```$xslt
omu --servers https://server.oracleoutsourcing.com,https://server.oracleoutsourcing.com 
     --keys  SERVER_1_KEY,SERVER_2_KEY 
     --imagepath images
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
