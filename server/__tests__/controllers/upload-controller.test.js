const uploadController = require('../../src/controllers/upload-controller');
const fs = require('fs/promises');
const fsSync = require('fs');

jest.mock('fs/promises');
jest.mock('fs', () => ({
    createReadStream: jest.fn()
}));
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

describe('Upload Controller (Unit)', () => {
    let ctx;
    beforeEach(() => {
        ctx = { 
            params: {}, 
            request: { files: {} }, 
            status: undefined, 
            body: undefined,
            host: 'localhost:8080'
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('uploadImage', () => {
        it('should upload image successfully', async () => {
            ctx.request.files = { 
                upload: { 
                    filepath: '/tmp/test.jpg', 
                    type: 'image/jpeg' 
                } 
            };
            fs.copyFile.mockResolvedValue();

            await uploadController.uploadImage(ctx);

            expect(fs.copyFile).toHaveBeenCalled();
            expect(ctx.status).toBe(201);
            expect(ctx.body.links.path).toBe('http://localhost:8080/api/v1/images/test-uuid.jpg');
        });

        it('should default to image/jpeg if type is not provided', async () => {
            ctx.request.files = { upload: { filepath: '/tmp/test' } };
            fs.copyFile.mockResolvedValue();

            await uploadController.uploadImage(ctx);
            expect(ctx.body.links.path).toContain('.jpg');
        });

        it('should return 400 if no file is uploaded', async () => {
            ctx.request.files = {};

            await uploadController.uploadImage(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ message: "No file uploaded" });
            expect(fs.copyFile).not.toHaveBeenCalled();
        });

        it('should return 500 on file copy error', async () => {
            ctx.request.files = { upload: { filepath: '/tmp/err' } };
            const error = new Error('Disk full');
            fs.copyFile.mockRejectedValue(error);

            await uploadController.uploadImage(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ message: 'Disk full' });
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('getImage', () => {
        it('should get image successfully', async () => {
            ctx.params.filename = 'test-uuid.jpeg';
            fs.access.mockResolvedValue();
            const mockStream = { pipe: jest.fn() };
            fsSync.createReadStream.mockReturnValue(mockStream);

            await uploadController.getImage(ctx);

            expect(fs.access).toHaveBeenCalled();
            expect(fsSync.createReadStream).toHaveBeenCalled();
            expect(ctx.type).toBe('image/jpeg');
            expect(ctx.body).toBe(mockStream);
        });

        it('should get image without recognized extension defaulting to octet-stream', async () => {
            ctx.params.filename = 'test-uuid.unknown';
            fs.access.mockResolvedValue();
            fsSync.createReadStream.mockReturnValue({});

            await uploadController.getImage(ctx);

            expect(ctx.type).toBe('application/octet-stream');
        });

        it('should return 404 if image does not exist', async () => {
            ctx.params.filename = 'missing.jpeg';
            fs.access.mockRejectedValue(new Error('ENOENT'));

            await uploadController.getImage(ctx);

            expect(ctx.status).toBe(404);
            expect(fsSync.createReadStream).not.toHaveBeenCalled();
        });
    });
});
