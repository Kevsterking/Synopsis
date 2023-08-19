function AVLTreeNode(key) {
  this.key = key;
  this.left = null;
  this.right = null;
}

// TODO: Not actually a avl tree only bst tree at the moment. fix it
function AVLTree(compare) {
  
  this.root = null; 
  this.compare = compare;

  const _insert = (node, key) => {
    
    /* If the tree is empty, return a new node */
    if (node === null) {
      return new AVLTreeNode(key);
    }
   
    /* Otherwise, recur down the tree */
    if (this.compare(key, node.key)) {
      node.right = _insert(node.right, key);
    } else {
      node.left = _insert(node.left, key);
    }
   
    /* return the (unchanged) node pointer */
    return node;
  
  }

  const _delete = (node, key) => {
    
    // Base case
    if (node === null) {
      return node;
    }
    
    if (key == node.key) {
     
      // If one of the children is empty
      if (node.left === null) {
        let temp = node.right;
        delete node;
        return temp;
      } else if (node.right === null) {
        let temp = node.left;
        delete node;
        return temp;
      }
    
      // If both children exist
      else {
        
        let succParent = node;
    
        // Find successor
        let succ = node.right;
        while (succ.left !== null) {
          succParent = succ;
          succ = succ.left;
        }
    
        // Delete successor.  Since successor
        // is always left child of its parent
        // we can safely make successor's right
        // right child as left of its parent.
        // If there is no succ, then assign
        // succ.right to succParent.right
        if (succParent !== node) {
          succParent.left = succ.right;
        } else {
          succParent.right = succ.right;
        }
    
        // Copy Successor Data to node
        node.key = succ.key;
    
        // Delete Successor and return node
        delete succ;
        return node;
      }
    }
    else if (this.compare(key, node.key)) {
      node.right = _delete(node.right, key);
      return node;
    } else {
      node.left = _delete(node.left, key);
      return node;
    }
   
    
  }

  const _max = (node) => {
    return (node.right ? _max(node.right) : node);
  }

  this.insert = (key) => {
    this.root = _insert(this.root, key);
  }

  this.delete = (key) => {
    this.root = _delete(this.root, key);
  } 

  this.max = () => {
    if (!this.root) return null;
    const max_node = _max(this.root); 
    return max_node ? max_node.key : null;
  }


}