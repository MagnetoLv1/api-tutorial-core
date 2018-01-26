import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { DragulaService } from './dragula.provider';
import { Dragula } from './dragula';

@Directive({selector: '[dragula]'})
export class DragulaDirective implements OnInit, OnChanges {
  @Input() public dragula: string;
  @Input() public dragulaModel: any;
  @Input() public dragulaOptions: any;
  private container: any;
  private drake: any;

  private el: ElementRef;
  private dragulaService: DragulaService;
  public constructor(el: ElementRef, dragulaService: DragulaService) {
    this.el = el;
    this.dragulaService = dragulaService;
    this.container = el.nativeElement;
  }

  public ngOnInit(): void {
    // console.log(this.bag);
    let bag = this.dragulaService.find(this.dragula);
    let checkModel = () => {
      if (this.dragulaModel) {
        if (this.drake.models) {
          this.drake.models.push(this.dragulaModel);
        } else {
          this.drake.models = [this.dragulaModel];
        }
      }
    };
    if (bag) {
      this.drake = bag.drake;
      checkModel();
      this.drake.containers.push(this.container);
    } else {
      let d = new Dragula([this.container], Object.assign({}, this.dragulaOptions));
      checkModel();
      this.dragulaService.add(this.dragula, d.drake);
    }
  }

  public ngOnChanges(changes: {dragulaModel?: SimpleChange}): void {
    // console.log('dragula.directive: ngOnChanges');
    // console.log(changes);
    if (changes && changes.dragulaModel) {
      if (this.drake) {
        if (this.drake.models) {
          let modelIndex = this.drake.models.indexOf(changes.dragulaModel.previousValue);
          this.drake.models.splice(modelIndex, 1, changes.dragulaModel.currentValue);
        } else {
          this.drake.models = [changes.dragulaModel.currentValue];
        }
      }
    }
  }
}
