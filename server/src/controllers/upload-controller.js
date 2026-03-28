const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const fs = require('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');

const uploadDir = path.join(process.cwd(), 'uploads');

(async () => {
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
        console.error('Error creating upload dir:', err);
    }
})();

async function uploadImage(ctx) {
    try {
        const upload = ctx.request.files.upload;
        if (!upload) {
            ctx.status = 400;
            ctx.body = { message: "No file uploaded" };
            return;
        }
        const fileType = upload.type || 'image/jpeg';
        const extension = mime.extension(fileType);
        const imageName = `${uuidv4()}.${extension}`;
        const storagePath = path.join(uploadDir, imageName);
        await fs.copyFile(upload.filepath, storagePath);
        ctx.status = 201;
        ctx.body = {
            links: {
                path: `http://${ctx.host}/api/v1/images/${imageName}`
            }
        };
    } catch (err) {
        console.error(err);
        ctx.status = 500;
        ctx.body = { message: err.message };
    }
}

async function getImage(ctx) {
    const filename = ctx.params.filename;
    const filePath = path.join(uploadDir, filename);
    try {
        await fs.access(filePath);
        const src = createReadStream(filePath);
        ctx.type = mime.lookup(filePath) || 'application/octet-stream';
        ctx.body = src;
    } catch (err) {
        ctx.status = 404;
    }
}

module.exports = {
    uploadImage,
    getImage
};
