import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFavorites } from './character-favorites';

describe('CharacterFavorites', () => {
  let component: CharacterFavorites;
  let fixture: ComponentFixture<CharacterFavorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFavorites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFavorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
