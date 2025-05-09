# Cloudinary Integration for NestJS

This module provides Cloudinary integration for the NestJS application, allowing for easy image uploads and management.

## Features

- Upload single and multiple images to Cloudinary
- Store image URLs in the database
- Delete images from Cloudinary
- Configurable upload options (folder, transformation, etc.)

## Setup

1. The Cloudinary provider is configured in `cloudinary.provider.ts` and uses environment variables for configuration.
2. The Cloudinary service is implemented in `cloudinary.service.ts` and provides methods for uploading and deleting images.
3. The Cloudinary module is defined in `cloudinary.module.ts` and exports the provider and service.

## Environment Variables

Make sure the following environment variables are set in your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

## Usage

### Uploading Images

To upload images, you need to:

1. Import the CloudinaryModule in your feature module:

```typescript
import { CloudinaryModule } from 'src/common/providers/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  // ...
})
export class YourModule {}
```

2. Inject the CloudinaryService in your service:

```typescript
import { CloudinaryService } from 'src/common/providers/cloudinary.service';

@Injectable()
export class YourService {
  constructor(
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadMultipleImages(files);
  }
}
```

3. Use FilesInterceptor in your controller to handle file uploads:

```typescript
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerMemoryConfig } from 'src/common/config/multer.config';

@Controller('your-endpoint')
export class YourController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryConfig))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrls = await this.yourService.uploadMultipleImages(files);
    return {
      data: { imageUrls },
      message: 'Images uploaded successfully',
      success: true,
    };
  }
}
```

### Example API Requests

See the `api/products.http` file for example API requests that demonstrate how to use the Cloudinary integration with the Products API.

## File Upload Configuration

The file upload configuration is defined in `src/common/config/multer.config.ts` and provides two configurations:

1. `multerConfig`: Uses disk storage for file uploads
2. `multerMemoryConfig`: Uses memory storage for file uploads (preferred for Cloudinary)

The memory storage configuration is recommended for Cloudinary uploads as it allows for direct streaming of the file buffer to Cloudinary without saving the file to disk first.
