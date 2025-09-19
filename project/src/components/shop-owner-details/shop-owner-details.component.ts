import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopOwnerService } from '../../services/shop-owner.service';
import { ShopOwner } from '../../models/shop-owner.model';

@Component({
  selector: 'app-shop-owner-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Back to List</button>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="editOwner()" *ngIf="owner">
            ✏️ Edit
          </button>
          <button class="btn btn-danger" (click)="deleteOwner()" *ngIf="owner">
            🗑️ Delete
          </button>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading owner details...</p>
      </div>

      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <div>
            <h3>Error Loading Details</h3>
            <p>{{ error }}</p>
            <button class="btn btn-secondary" (click)="loadOwner()">Retry</button>
          </div>
        </div>
      </div>

      <div class="owner-details" *ngIf="owner && !loading && !error">
        <div class="owner-card">
          <div class="card-header">
            <div class="owner-avatar">
              {{ owner.ownerName.charAt(0).toUpperCase() }}
            </div>
            <div class="owner-info">
              <h1 class="owner-name">{{ owner.ownerName }}</h1>
              <p class="owner-email">{{ owner.email }}</p>
            </div>
          </div>

          <div class="card-body">
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon">👤</div>
                <div class="detail-content">
                  <span class="detail-label">Owner Name</span>
                  <span class="detail-value">{{ owner.ownerName }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon">📧</div>
                <div class="detail-content">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value">{{ owner.email }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon">🏪</div>
                <div class="detail-content">
                  <span class="detail-label">Shop Name</span>
                  <span class="detail-value shop-name">{{ owner.shopName }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon">📍</div>
                <div class="detail-content">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{ owner.location }}</span>
                </div>
              </div>

              <div class="detail-item" *ngIf="owner.id">
                <div class="detail-icon">🆔</div>
                <div class="detail-content">
                  <span class="detail-label">Owner ID</span>
                  <span class="detail-value">#{{ owner.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="footer-actions">
              <button class="btn btn-primary" (click)="editOwner()">
                ✏️ Edit Owner
              </button>
              <button class="btn btn-outline" (click)="goBack()">
                ← Back to List
              </button>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <button class="action-card" (click)="editOwner()">
              <div class="action-icon">✏️</div>
              <div class="action-content">
                <h4>Edit Details</h4>
                <p>Update owner information</p>
              </div>
            </button>
            
            <button class="action-card" (click)="goBack()">
              <div class="action-icon">📋</div>
              <div class="action-content">
                <h4>View All</h4>
                <p>See all shop owners</p>
              </div>
            </button>
            
            <button class="action-card danger" (click)="deleteOwner()">
              <div class="action-icon">🗑️</div>
              <div class="action-content">
                <h4>Delete Owner</h4>
                <p>Remove from system</p>
              </div>
            </button>
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
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

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    .btn-outline {
      background: transparent;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .btn-outline:hover {
      background: #f8fafc;
    }

    .loading-spinner {
      text-align: center;
      padding: 4rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: #dc2626;
    }

    .error-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .error-icon {
      font-size: 2rem;
    }

    .owner-details {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .owner-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #f1f5f9;
    }

    .card-header {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .owner-avatar {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }

    .owner-info h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .owner-email {
      margin: 0.5rem 0 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .card-body {
      padding: 2rem;
    }

    .details-grid {
      display: grid;
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .detail-icon {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .detail-content {
      flex: 1;
    }

    .detail-label {
      display: block;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      color: #1e293b;
      font-weight: 600;
    }

    .shop-name {
      color: #3b82f6;
    }

    .card-footer {
      padding: 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .footer-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .quick-actions {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      height: fit-content;
      border: 1px solid #f1f5f9;
    }

    .quick-actions h3 {
      margin: 0 0 1rem;
      color: #1e293b;
      font-size: 1.125rem;
    }

    .actions-grid {
      display: grid;
      gap: 1rem;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .action-card:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .action-card.danger:hover {
      background: #fef2f2;
      border-color: #fecaca;
      color: #dc2626;
    }

    .action-icon {
      width: 36px;
      height: 36px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .action-content h4 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
    }

    .action-content p {
      margin: 0.25rem 0 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .owner-details {
        grid-template-columns: 1fr;
      }

      .card-header {
        padding: 1.5rem;
        flex-direction: column;
        text-align: center;
      }

      .owner-avatar {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }

      .owner-info h1 {
        font-size: 1.5rem;
      }

      .footer-actions {
        flex-direction: column;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ShopOwnerDetailsComponent implements OnInit {
  owner?: ShopOwner;
  loading = false;
  error = '';

  constructor(
    private shopOwnerService: ShopOwnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOwner(id);
    } else {
      this.error = 'Invalid owner ID';
    }
  }

  loadOwner(id?: number): void {
    const ownerId = id || Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.error = '';

    this.shopOwnerService.getOwnerById(ownerId).subscribe({
      next: (owner) => {
        this.owner = owner;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  editOwner(): void {
    if (this.owner?.id) {
      this.router.navigate(['/edit', this.owner.id]);
    }
  }

  deleteOwner(): void {
    if (this.owner && confirm(`Are you sure you want to delete ${this.owner.ownerName}? This action cannot be undone.`)) {
      this.shopOwnerService.deleteOwner(this.owner.id!).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert(`Error deleting owner: ${error}`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}