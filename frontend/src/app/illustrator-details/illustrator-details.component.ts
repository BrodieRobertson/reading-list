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
      this.illustrators.getIllustrator(params.get('illustratorId')).subscribe((res) => {this.illustrator = IllustratorService.extractIllustrator(res)})
      if(!this.illustrator) {
        this.illustrator = new Illustrator()
      }
    })
  }

  /**
   * Switches to the edit form if the illustrator can be edited
   */
  onEdit() {
    if(this.illustrator.id === "-1") {
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
    if(this.illustrator.id === "-1") {
      window.alert("This illustrator can not be deleted")
    }
    else {
      var answer: Boolean = window.confirm("Are you sure you want to delete " + this.illustrator.name + "?");
      if(answer) {
        this.illustrators.removeIllustrator(this.illustrator.id).subscribe((res) => {
          window.alert(this.illustrator.name + " has been deleted, returning to the list");
          this.router.navigateByUrl("/")
        });
      }
    }
  }
}
