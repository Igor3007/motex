'use strict';
import sftp from "node-sftp-deploy";

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    REMOTE_ROOT,
    LOCAL_ROOT
} = process.env;

const config = {
    host: HOST,
    port: PORT,
    user: USER,
    pass: PASSWORD,
    remotePath: REMOTE_ROOT,
    sourcePath: LOCAL_ROOT
}

sftp(config).then((result) => {
    console.log(result);
});