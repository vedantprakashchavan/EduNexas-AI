import { Request, Response } from 'express';
import { documentService } from './document.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class DocumentController {
  async upload(req: Request, res: Response) {
    // In production: multer handles the file upload, stores to cloud storage
    // Here we simulate with body data
    const { title, documentType } = req.body;

    const doc = await documentService.create({
      title: title || 'Untitled Document',
      fileName: `doc_${Date.now()}.pdf`,
      fileUrl: `/uploads/documents/doc_${Date.now()}.pdf`,
      fileType: 'application/pdf',
      fileSize: Math.floor(Math.random() * 500000) + 100000,
      documentType: documentType || 'other',
      uploadedBy: req.user!.userId,
    });

    return ApiResponse.success(res, doc, 'Document uploaded successfully', 201);
  }

  async process(req: Request, res: Response) {
    const id = req.params.id as string;
    const doc = await documentService.processDocument(id);
    return ApiResponse.success(res, doc, 'Document processed with AI extraction');
  }

  async verify(req: Request, res: Response) {
    const id = req.params.id as string;
    const doc = await documentService.verify(id, req.user!.userId);
    return ApiResponse.success(res, doc, 'Document verified');
  }

  async findAll(req: Request, res: Response) {
    const { status, documentType, page, limit } = req.query;
    const result = await documentService.findAll({
      status: status as string | undefined,
      documentType: documentType as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return ApiResponse.paginated(res, result.docs, result.page, result.limit, result.total);
  }

  async findById(req: Request, res: Response) {
    const doc = await documentService.findById(req.params.id as string);
    return ApiResponse.success(res, doc);
  }

  async delete(req: Request, res: Response) {
    await documentService.delete(req.params.id as string);
    return ApiResponse.success(res, null, 'Document deleted');
  }

  async getStats(req: Request, res: Response) {
    const stats = await documentService.getStats();
    return ApiResponse.success(res, stats);
  }
}

export const documentController = new DocumentController();
