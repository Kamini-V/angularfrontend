import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopOwnerService } from '../../services/shop-owner.service';
import { ShopOwner } from '../../models/shop-owner.model';

@Component({
  selector: 'app-shop-owner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <h1 class="title">{{ isEditMode ? 'Edit' : 'Create New' }} Shop Owner</h1>
      </div>

      <div class="form-container">
        <form [formGroup]="ownerForm" (ngSubmit)="onSubmit()" class="owner-form">
          <div class="form-group">
            <label for="ownerName" class="form-label">Owner Name *</label>
            <input
              type="text"
              id="ownerName"
              formControlName="ownerName"
              class="form-input"
              [class.error]="isFieldInvalid('ownerName')"
              placeholder="Enter owner's full name"
            />
            <div class="error-message" *ngIf="isFieldInvalid('ownerName')">
              <span *ngIf="ownerForm.get('ownerName')?.errors?.['required']">Owner name is required</span>
              <span *ngIf="ownerForm.get('ownerName')?.errors?.['minlength']">Owner name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-input"
              [class.error]="isFieldInvalid('email')"
              placeholder="owner@example.com"
            />
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              <span *ngIf="ownerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="ownerForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div class="form-group">
            <label for="shopName" class="form-label">Shop Name *</label>
            <input
              type="text"
              id="shopName"
              formControlName="shopName"
              class="form-input"
              [class.error]="isFieldInvalid('shopName')"
              placeholder="Enter shop name"
            />
            <div class="error-message" *ngIf="isFieldInvalid('shopName')">
              <span *ngIf="ownerForm.get('shopName')?.errors?.['required']">Shop name is required</span>
              <span *ngIf="ownerForm.get('shopName')?.errors?.['minlength']">Shop name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="location" class="form-label">Location *</label>
            <input
              type="text"
              id="location"
              formControlName="location"
              class="form-input"
              [class.error]="isFieldInvalid('location')"
              placeholder="Enter shop location"
            />
            <div class="error-message" *ngIf="isFieldInvalid('location')">
              <span *ngIf="ownerForm.get('location')?.errors?.['required']">Location is required</span>
              <span *ngIf="ownerForm.get('location')?.errors?.['minlength']">Location must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()" [disabled]="loading">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="ownerForm.invalid || loading">
              <span class="btn-spinner" *ngIf="loading"></span>
              {{ loading ? 'Saving...' : (isEditMode ? 'Update Owner' : 'Create Owner') }}
            </button>
          </div>
        </form>

        <div class="form-preview" *ngIf="ownerForm.valid">
          <h3>Preview</h3>
          <div class="preview-card">
            <div class="preview-item">
              <span class="preview-label">Owner Name:</span>
              <span class="preview-value">{{ ownerForm.get('ownerName')?.value }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">Email:</span>
              <span class="preview-value">{{ ownerForm.get('email')?.value }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">Shop Name:</span>
              <span class="preview-value">{{ ownerForm.get('shopName')?.value }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">Location:</span>
              <span class="preview-value">{{ ownerForm.get('location')?.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="error-alert" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <div>
            <h4>Error</h4>
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-btn {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .form-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .owner-form {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #d1d5db;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .form-preview {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .form-preview h3 {
      margin: 0 0 1rem;
      color: #374151;
      font-size: 1.125rem;
    }

    .preview-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      background: #f9fafb;
    }

    .preview-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .preview-item:last-child {
      border-bottom: none;
    }

    .preview-label {
      font-weight: 500;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .preview-value {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.875rem;
    }

    .error-alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .error-icon {
      font-size: 1.5rem;
    }

    .error-content h4 {
      margin: 0;
      color: #dc2626;
    }

    .error-content p {
      margin: 0.25rem 0 0;
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .form-container {
        grid-template-columns: 1fr;
      }

      .form-preview {
        position: static;
      }

      .form-actions {
        flex-direction: column;
      }

      .title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ShopOwnerFormComponent implements OnInit {
  ownerForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  ownerId?: number;

  constructor(
    private fb: FormBuilder,
    private shopOwnerService: ShopOwnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ownerForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      shopName: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.ownerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.ownerId;

    if (this.isEditMode) {
      this.loadOwnerData();
    }
  }

  loadOwnerData(): void {
    this.loading = true;
    this.shopOwnerService.getOwnerById(this.ownerId!).subscribe({
      next: (owner) => {
        this.ownerForm.patchValue(owner);
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ownerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.ownerForm.invalid) {
      this.ownerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const ownerData: ShopOwner = this.ownerForm.value;

    const request = this.isEditMode
      ? this.shopOwnerService.updateOwner(this.ownerId!, ownerData)
      : this.shopOwnerService.createOwner(ownerData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}