import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'click2purchase_products' },
        (error, result) => {
          if (error) return reject(error);
          
          if (!result) return reject(new Error('Cloudinary result is undefined'));

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}