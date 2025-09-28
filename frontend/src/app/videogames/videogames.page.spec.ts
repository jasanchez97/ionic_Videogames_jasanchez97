import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideogamesPage } from './videogames.page';

describe('VideogamesPage', () => {
  let component: VideogamesPage;
  let fixture: ComponentFixture<VideogamesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideogamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
