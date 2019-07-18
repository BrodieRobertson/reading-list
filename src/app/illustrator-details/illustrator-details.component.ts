import { IllustratorService } from './../services/illustrator.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Illustrator } from '../models/illustrator';

@Component({
  selector: 'app-illustrator-details',
  templateUrl: './illustrator-details.component.html',
  styleUrls: ['./illustrator-details.component.css']
})
export class IllustratorDetailsComponent implements OnInit {
  illustrator: Illustrator

  constructor(private route: ActivatedRoute, private illustrators: IllustratorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var tempIllustrator: Illustrator = this.illustrators.getIllustrator(Number(params.get('illustratorId')))
      if(tempIllustrator) {
        this.illustrator = tempIllustrator;
      }
      else {
        this.illustrator = new Illustrator();
      }
    })
  }

}
