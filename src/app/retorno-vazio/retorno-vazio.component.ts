import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-retorno-vazio',
  templateUrl: './retorno-vazio.component.html',
  styleUrls: ['./retorno-vazio.component.scss'],
})
export class RetornoVazioComponent implements OnInit {
  @Input() message: string;
  @Input() srcImage: string;

  constructor() { }

  ngOnInit() { }

}
