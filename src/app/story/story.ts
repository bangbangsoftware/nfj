import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StoryItem, Acceptance, Tag } from '../shared';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';


@Component({
  selector: 'story',
  viewProviders: [FormBuilder],
  templateUrl: 'story.html',
  styleUrls: ['story.css'],
})
export class Story implements OnInit {

  listID = 0;
  fb: FormBuilder;
  storyForm: FormGroup;
  newTitle: FormControl;
  newTag: FormControl;
  newDescriptionAs: FormControl;
  newDescriptionWant: FormControl;
  newDescriptionThat: FormControl;
  newColour: FormControl;
  newAC: FormControl;
  acs: Array<string>;
  tags: Array<string>;
  needAcs: boolean;
  storyID: number;
  back: string;
  ac;
 selectedColour = 6;

  constructor(fb: FormBuilder, private session: SessionService, private route: ActivatedRoute, private router: Router) {
    this.fb = fb;
    this.newTitle = new FormControl('', Validators.required);
    this.newTag = new FormControl('', Validators.required);
    this.newDescriptionAs = new FormControl('', Validators.required);
    this.newDescriptionWant = new FormControl('', Validators.required);
    this.newDescriptionThat = new FormControl('', Validators.required);
    this.newColour = new FormControl('white');
    this.acs = [];
    this.newAC = new FormControl('');
    this.needAcs = false;
    this.storyForm = this.fb.group({
      'newTitle': this.newTitle,
      'newTag': this.newTag,
      'newDescriptionAs': this.newDescriptionAs,
      'newDescriptionWant': this.newDescriptionWant,
      'newDescriptionThat': this.newDescriptionThat,
      'newColour': this.newColour
    });

  }

  ngOnInit(): void {
    console.log('story component woke....');
    this.session.isIn();
    this.storyID = this.route.snapshot.params['storyID'];
    this.back = this.route.snapshot.params['back'];
    if (this.storyID) {
      this.editStory(this.session.project.stories[this.listID].items[this.storyID]);
    }
    this.selectedColour = -1;
  }

  selectColour(c) {
    this.selectedColour = c;
    this.newColour.setValue(this.session.defaults.coloursClasses[c]);
  }

  buttonFocus() {
    this.ac.focus();
  }

  removeStory(item: StoryItem) {
    const index = this.session.project.stories[this.listID].items.indexOf(item);
    this.session.project.stories[this.listID].items.splice(index, 1);
  }

  editStory(item: StoryItem) {
    this.newTitle.setValue(item.title);
    this.newTag.setValue(item.tags[0].name);
    this.newDescriptionAs.setValue(item.descriptionAs);
    this.newDescriptionWant.setValue(item.descriptionWant);
    this.newDescriptionThat.setValue(item.descriptionThat);
    this.newColour.setValue(item.colour);
    this.selectedColour = this.session.defaults.colours.indexOf(item.colour);
    this.newAC.setValue('');
    this.acs = item.acs.map(a => a.name);
    this.needAcs = false;
  }

  clearStory() {
    this.storyForm.reset();
    this.acs = [];
    this.needAcs = false;
  }

  onSubmit(): void {
    this.addCriteria();
    if (this.acs.length === 0) {
      this.needAcs = true;
    } else if (this.storyForm.valid) {
      const acceptances = this.acs.map(a => new Acceptance(a));
      const tag = new Tag(this.newTag.value);
      this.session.project.stories[this.listID].items.push(
        new StoryItem(this.newTitle.value, this.newColour.value,
          this.newDescriptionAs.value, this.newDescriptionWant.value,
          this.newDescriptionThat.value, -1, acceptances, [tag]));
      this.clearStory();
      if (this.back) {
        this.router.navigate([this.back]);
      }
    }
  }

  removeCriteria(i): void {
    this.acs.splice(i, 1);
  }

  checkAC(): void {
    if (this.newAC.value) {
      this.needAcs = false;
    }
  }

  addCriteria(): void {
    if (this.newAC.value) {
      this.acs.push(this.newAC.value);
      this.newAC.reset();
    }
  }

  tab(e) {
    if (e.keyCode === 9) { // press tab
      this.addCriteria();
      this.ac = e.target.parentNode.firstElementChild;
    }
  }

  removeTag(i): void {
    this.tags.splice(i, 1);
  }

  addTag(): void {
    if (this.newTag.value) {
      this.tags.push(this.newTag.value);
      this.newTag.reset();
    }
  }

  tagTab(e) {
    if (e.keyCode === 9) { // press tab
      this.addTag();
//      this.tag = e.target.parentNode.firstElementChild;
    }
  }


}
