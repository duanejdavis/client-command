import { Component, Injectable, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { of as ofObservable, Observable, BehaviorSubject } from 'rxjs';


export class Nodes {
  name: string;
  //tree: Array;
}

export const TREE_DATA  = {
  "id": 'root',
  "color": 'root',
  "level": 1,
  "label": "5",
  "nodeTotal": 5,
  "child": []
};


/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'tree',
  templateUrl: 'tree.html',
  styleUrls: ['tree.css'],
  encapsulation: ViewEncapsulation.None
})
export class TreeAssessment {

  public TREE: string = '';
  public container: string = '';
  public addListenFunc: Function;

  public addNode: boolean = false;
  public indentAddChildNode: boolean = false;
  public isRootNode: boolean = true;
  public nodeColor: string = '';
  public currentNode: string = '';
  public total: number = 0;

  constructor(private elementRef:ElementRef, renderer: Renderer2) {
    this.setTree(this.buildTree(TREE_DATA, this.container));
  
    this.addListenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
      switch (event.target.getAttribute('action')) {
        case "addNode":
          this.addNewItem(event, renderer);
          break;
        case "saveNode":
          this.saveNewItem();
          break;
        case "deleteNode":
          this.deleteNode(event);
          break;
      }
    });
  }

  setTree(tree){
    this.TREE = tree;
  }
  getTree(){
    return this.TREE;
  }
  setCurrentNode(id){
    this.currentNode = id;
  }
  getCurrentNode(){
    return this.currentNode;
  }

  buildTree(DATA, container){

    let newNode: string = '';
    let color: string = '';

     for(let key in DATA) {
 
       const value = DATA[key];

      if(key === 'color'){
        color = value;
        newNode = '<div class="node '+ value +'"';
      }      

       if(key === 'level'){
         let depth = value * 30;
         newNode += 'style="margin-left:' + depth +'px;">';
       }

       if(key ==='label'){
         newNode += value;
       }

       if(key === 'nodeTotal'){
         if(color === 'green'){
           newNode+= '<button><i action="deleteNode" class="fas fa-minus-square" (click)=""></i></button>';
         }
         newNode += '<button><i action="addNode"  id="node-' + value + '" (click)="" class="fas fa-plus-square"></i></button></div>';
         this.total = this.total + value; 
         this.container += newNode;
       }

       if(key === 'child'){
         newNode = container;
         for(let nodeObj in value){
           this.buildTree(value[nodeObj], newNode);
         }
         
       }

     }
     
     return this.container;
   }

   addNewItem(event, renderer){
     this.addNode = true;
     if(event.target.id === 'node-5'){
       this.isRootNode = true;
     }
     this.setCurrentNode(event.target.id);
   }

   deleteNode(event){

   }

   addChildNode(event){
     this.indentAddChildNode = true;
   }
   saveNewItem(){
     let currentNode = this.getCurrentNode();
     this.updateTREE(this.nodeColor, currentNode);
   }

   updateTREE(nodeColor, currentNode){

     let newLabel: string;
     let newLabelTotal: number;
     let parentLabel: number = parseInt(currentNode.split('-').pop());
     let nodeID: string = "node-" + newLabelTotal;
     let NODE; 

     switch (nodeColor) {
         case "red":
           newLabelTotal = parentLabel + 1;
           newLabel = parentLabel + ' + ' + '1' + ' = ' + newLabelTotal;
           break;
         case "green":
           newLabelTotal = parentLabel + 2;
           newLabel = parentLabel + ' + ' + '2' + ' = ' + newLabelTotal;
           break;
         default:
           // code...
           break;
      }

      let newObj = {"id": newLabelTotal, "color": nodeColor, "level": 2, "label":  newLabel, "nodeTotal": newLabelTotal, "child": []};

     if(this.isRootNode){
      
       TREE_DATA['child'].push(newObj);  
       this.isRootNode = false;

     } else {

       NODE = this.findNode(TREE_DATA.child, parseInt(currentNode.split('-').pop()));
       newObj.level = NODE.level + 1;
       NODE.child.push(newObj);
     
     }

     this.clearTree();
     this.addNode = false;
      this.setTree(this.buildTree(TREE_DATA, this.container));
   }

   clearTree(){
     this.total = 0;
     this.container = '';
   }
   findNode(DATA, currentNodeID){
    
     let child;

     for(let nodeObj in DATA){
       if(DATA[nodeObj].id === currentNodeID){         
         return DATA[nodeObj];
       } 
       child = DATA[nodeObj].child;
     }
     return this.findNode(child, currentNodeID);
   }
}