import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopOwnerService } from '../../services/shop-owner.service';
import { ShopOwner } from '../../models/shop-owner.model';

@Component({
  selector: 'app-shop-owner-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1 class="title">Shop Owner Management</h1>
        <button class="btn btn-primary" (click)="navigateToCreate()">
          <span class="btn-icon">+</span>
          Add New Owner
        </button>
      </div>

      <div class="search-section">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search by owner name, email, shop name, or location..."
            [(ngModel)]="searchTerm"
            (input)="filterOwners()"
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <div class="stats-section" *ngIf="owners.length > 0">
        <div class="stat-card">
          <div class="stat-number">{{ owners.length }}</div>
          <div class="stat-label">Total Owners</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ filteredOwners.length }}</div>
          <div class="stat-label">Filtered Results</div>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading shop owners...</p>
      </div>

      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <div>
            <h3>Error Loading Data</h3>
            <p>{{ error }}</p>
            <button class="btn btn-secondary" (click)="loadOwners()">Retry</button>
          </div>
        </div>
      </div>

      <div class="owners-grid" *ngIf="!loading && !error">
        <div class="empty-state" *ngIf="filteredOwners.length === 0 && owners.length === 0">
          <div class="empty-icon">🏪</div>
          <h3>No Shop Owners Found</h3>
          <p>Get started by adding your first shop owner.</p>
          <button class="btn btn-primary" (click)="navigateToCreate()">
            Add First Owner
          </button>
        </div>

        <div class="empty-search" *ngIf="filteredOwners.length === 0 && owners.length > 0">
          <div class="empty-icon">🔍</div>
          <h3>No Results Found</h3>
          <p>Try adjusting your search terms.</p>
        </div>

        <div class="owner-card" *ngFor="let owner of filteredOwners; trackBy: trackByOwner">
          <div class="card-header">
            <h3 class="owner-name">{{ owner.ownerName }}</h3>
            <div class="card-actions">
              <button class="btn-icon-small" (click)="viewOwner(owner.id!)" title="View Details">
                👁️
              </button>
              <button class="btn-icon-small" (click)="editOwner(owner.id!)" title="Edit">
                ✏️
              </button>
              <button class="btn-icon-small delete" (click)="deleteOwner(owner.id!, owner.ownerName)" title="Delete">
                🗑️
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ owner.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Shop:</span>
              <span class="info-value shop-name">{{ owner.shopName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location:</span>
              <span class="info-value">{{ owner.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
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

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      max-width: 500px;
    }

    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: #64748b;
    }

    .stats-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      min-width: 120px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
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
      text-decoration: none;
      font-size: 1rem;
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
      background: #e2e8f0;
      color: #475569;
    }

    .btn-secondary:hover {
      background: #cbd5e1;
    }

    .btn-icon {
      font-size: 1.2rem;
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

    .owners-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .empty-state, .empty-search {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .owner-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;
      border: 1px solid #f1f5f9;
    }

    .owner-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0;
      margin-bottom: 1rem;
    }

    .owner-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon-small {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .btn-icon-small:hover {
      background: #e2e8f0;
      transform: scale(1.1);
    }

    .btn-icon-small.delete:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .card-body {
      padding: 0 1.5rem 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f8fafc;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 500;
      color: #64748b;
      font-size: 0.875rem;
    }

    .info-value {
      color: #1e293b;
      font-weight: 500;
    }

    .shop-name {
      color: #3b82f6;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .title {
        font-size: 2rem;
        text-align: center;
      }
      
      .owners-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-section {
        flex-direction: column;
      }
    }
  `]
})
export class ShopOwnerListComponent implements OnInit {
  owners: ShopOwner[] = [];
  filteredOwners: ShopOwner[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(
    private shopOwnerService: ShopOwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners(): void {
    this.loading = true;
    this.error = '';
    
    this.shopOwnerService.getAllOwners().subscribe({
      next: (owners) => {
        this.owners = owners;
        this.filteredOwners = owners;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  filterOwners(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOwners = this.owners;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredOwners = this.owners.filter(owner =>
      owner.ownerName.toLowerCase().includes(term) ||
      owner.email.toLowerCase().includes(term) ||
      owner.shopName.toLowerCase().includes(term) ||
      owner.location.toLowerCase().includes(term)
    );
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }

  viewOwner(id: number): void {
    this.router.navigate(['/view', id]);
  }

  editOwner(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deleteOwner(id: number, ownerName: string): void {
    if (confirm(`Are you sure you want to delete ${ownerName}? This action cannot be undone.`)) {
      this.shopOwnerService.deleteOwner(id).subscribe({
        next: () => {
          this.loadOwners();
        },
        error: (error) => {
          alert(`Error deleting owner: ${error}`);
        }
      });
    }
  }

  trackByOwner(index: number, owner: ShopOwner): number {
    return owner.id || index;
  }
}