import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuotesComponent } from './quotes.component';
import { QuoteService } from '../../services/quote.service';
import { Router, NavigationEnd, UrlTree } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

// Mock ActivatedRoute
const activatedRouteStub = {
  snapshot: {},
  paramMap: of(),
  queryParams: of({}),
};

const dummyUrlTree: UrlTree = {
  root: null!,
  queryParams: {},
  fragment: null,
  queryParamMap: null!
};

describe('QuotesComponent', () => {
  let component: QuotesComponent;
  let fixture: ComponentFixture<QuotesComponent>;
  let quoteServiceSpy: jasmine.SpyObj<QuoteService>;
  let routerEvents$: Subject<any>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    quoteServiceSpy = jasmine.createSpyObj('QuoteService', ['getQuotes', 'deleteQuote']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerEvents$ = new Subject();

    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree', 'serializeUrl'], { events: routerEvents$ });
    routerSpy.createUrlTree.and.returnValue(dummyUrlTree);
    routerSpy.serializeUrl.and.returnValue('');

    await TestBed.configureTestingModule({
      imports: [QuotesComponent],
      providers: [
        { provide: QuoteService, useValue: quoteServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
         { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quotes on init', () => {
    const mockQuotes = [{ text: 'Test quote', author: 'Tester' }];
    quoteServiceSpy.getQuotes.and.returnValue(of(mockQuotes));

    component.ngOnInit();

    expect(quoteServiceSpy.getQuotes).toHaveBeenCalled();
    expect(component.quotes).toEqual(mockQuotes);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set error message if getQuotes fails', () => {
    const mockError = { status: 500 };
    quoteServiceSpy.getQuotes.and.returnValue(throwError(() => mockError));

    component.ngOnInit();

    expect(component.error).toBe('Misslyckades att hämta citat');
    expect(component.loading).toBeFalse();
  });

  it('should set auth error if 401 is returned', fakeAsync(() => {
    const mockError = { status: 401 };
    quoteServiceSpy.getQuotes.and.returnValue(throwError(() => mockError));

    component.ngOnInit();
    tick();

    expect(component.error).toBe('Du måste logga in för att se citaten');
    expect(component.loading).toBeFalse();
  }));

  it('should reload quotes on NavigationEnd event', () => {
    quoteServiceSpy.getQuotes.and.returnValue(of([]));

    component.ngOnInit();
    routerEvents$.next(new NavigationEnd(1, '/quotes', '/quotes'));

    expect(quoteServiceSpy.getQuotes).toHaveBeenCalledTimes(2); // once on init, once on event
  });

  it('should delete quote if dialog is confirmed', () => {
    const dialogRefMock = { afterClosed: () => of(true) };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    quoteServiceSpy.deleteQuote.and.returnValue(of({}));
    quoteServiceSpy.getQuotes.and.returnValue(of([])); // for reload after delete

    component.deleteQuote('abc123');

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(quoteServiceSpy.deleteQuote).toHaveBeenCalledWith('abc123');
  });

  it('should NOT delete quote if dialog is cancelled', () => {
    const dialogRefMock = { afterClosed: () => of(false) };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    component.deleteQuote('abc123');

    expect(quoteServiceSpy.deleteQuote).not.toHaveBeenCalled();
  });

  it('should set error if deleteQuote fails', () => {
    const dialogRefMock = { afterClosed: () => of(true) };
    dialogSpy.open.and.returnValue(dialogRefMock as any);

    quoteServiceSpy.deleteQuote.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteQuote('abc123');

    expect(component.error).toBe('Misslyckades att radera citat');
    expect(component.loading).toBeFalse();
  });
});
