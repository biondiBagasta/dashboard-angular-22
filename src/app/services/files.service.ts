import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse } from '../interfaces/file-response';
import { baseUrl } from '../../utils/utils';

@Service()
export class FilesService {

  http = inject(HttpClient)

  uploadProductImage(image: FormData): Observable<FileResponse> {
    return this.http.post<FileResponse>(`${baseUrl}/files/product/upload`, image)
  }

  deleteProductImage(image: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/files/product/delete/${image}`)
  }
}
