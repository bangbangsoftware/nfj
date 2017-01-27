import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Story } from './story';


describe('StoryTest', () => {

    it('Should...', () =>{
        let fixture = TestBed.createComponent(Story);
        fixture.componentInstance.newTitle.setValue('what');
        fixture.detectChanges();
        let testElement = fixture.debugElement.nativeElement;
        expect(testElement.newTitle.value).toContain('what');
    });

});
