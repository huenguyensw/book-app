import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookForm } from './add-book.component';

describe('BookForm', () => {
  let component: AddBookForm;
  let fixture: ComponentFixture<AddBookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBookForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
