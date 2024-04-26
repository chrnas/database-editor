import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryExecuterComponent } from './query-executer.component';

describe('QueryExecuterComponent', () => {
  let component: QueryExecuterComponent;
  let fixture: ComponentFixture<QueryExecuterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryExecuterComponent]
    });
    fixture = TestBed.createComponent(QueryExecuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
