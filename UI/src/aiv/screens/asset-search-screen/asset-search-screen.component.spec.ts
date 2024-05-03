import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSearchScreenComponent } from './asset-search-screen.component';

describe('AssetSearchScreenComponent', () => {
  let component: AssetSearchScreenComponent;
  let fixture: ComponentFixture<AssetSearchScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSearchScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetSearchScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
