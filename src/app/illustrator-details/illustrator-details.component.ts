import { IllustratorService } from './../services/illustrator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Illustrator } from '../models/illustrator';

@Component({
  selector: 'app-illustrator-details',
  templateUrl: './illustrator-details.component.html',
  styleUrls: ['./illustrator-details.component.scss']
})
export class IllustratorDetailsComponent implements OnInit {
  illustrator: Illustrator

  constructor(private route: ActivatedRoute, private illustrators: IllustratorService, private router: Router) { }

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

  /**
   * Switches to the edit form if the illustrator can be edited
   */
  onEdit() {
    if(this.illustrator.id === -1) {
      window.alert("This illustrator can not be edited")
    }
    else {
      this.router.navigateByUrl("illustrator/" + this.illustrator.id + "/edit")
    }
  }

  /**
   * Confirms if this illustrator should be deleted if it can be deleted
   */
  onDelete() {
    if(this.illustrator.id === -1) {
      window.alert("This illustrator can not be deleted")
    }
    else {
      window.alert("Feature coming soon")
    }
  }
}
