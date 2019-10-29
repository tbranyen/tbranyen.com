window.audit = () => {
  const { keys } = Object;
  const { max } = Math;

  function maxTreeDepth(depth, el = document.body) {
    const newDepths = [depth];

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];

      if (child.nodeType !== 1) {
        continue;
      }

      newDepths.push(maxTreeDepth(depth + 1, child));
    }

    return max.apply(null, newDepths);
  }

  console.log('Max DOM Tree depth', maxTreeDepth(0));

  function totalNodes(total, el = document.body) {
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];

      if (child.nodeType !== 1) {
        continue;
      }

      total = totalNodes(total + 1, child);
    }

    return total;
  }

  console.log('Total DOM Nodes', totalNodes(0));

  function findReact16(el = document.body, root = null) {
    for (let i = 0; i < el.children.length; i++) {
      if (root) { return root; }

      const child = el.children[i];

      // Located a Root react component.
      if (child && child._reactRootContainer) {
        root = child._reactRootContainer._internalRoot;
      }
      else {
        root = findReact16(child, root);
      }
    }

    return root;
  }

  function findReact15(el = document.body, root = null) {
    for (let i = 0; i < el.children.length; i++) {
      if (root) { return root; }

      const child = el.children[i];

      // Located a Root react component.
      const domKeys = keys(child);

      if (domKeys[0] && domKeys[0].includes('react')) {
        root = child[domKeys[0]]._currentElement;
      }
      else {
        root = findReact15(child, root);
      }
    }

    return root;
  }

  const react16 = findReact16(document.body);
  const react15 = findReact15(document.body);

  if (react16) {
    console.log('Found React 16');
  }

  if (react15) {
    console.log('Found React 15');
  }

  function react16MaxTreeDepth(depth, root) {
    const newDepths = [depth];
    let sibling = null;

    if (root.sibling) {
      newDepths.push(react16MaxTreeDepth(depth, root.sibling));
    }

    if (root.child) {
      newDepths.push(react16MaxTreeDepth(depth + 1, root.child));
    }

    return max.apply(null, newDepths);
  }

  if (react16) {
    console.log(
      'Max React Tree depth',
      react16MaxTreeDepth(0, react16.current),
    );
  }

  function react16TotalNodes(total, root) {
    if (root.sibling) {
      total = react16TotalNodes(total + 1, root.sibling);
    }

    if (root.child) {
      total = react16TotalNodes(total + 1, root.child);
    }

    return total;
  }

  if (react16) {
    console.log(
      'Total React Nodes',
      react16TotalNodes(0, react16.current),
    );
  }

  function react15MaxTreeDepth(depth, root) {
    const newDepths = [depth];
    const { props = {} } = root;
    const children = [].concat(props.children).filter(Boolean);

    if (root._owner) {
      newDepths.push(react15MaxTreeDepth(depth + 1, root._owner));
    }

    for (let i = 0; i < children.length; i++) {
      newDepths.push(react15MaxTreeDepth(depth + 1, children[i]));
    }

    return max.apply(null, newDepths);
  }

  if (react15) {
    console.log(
      'Max React Tree depth',
      react15MaxTreeDepth(0, react15),
    );
  }

  function react15TotalNodes(total, root) {
    const {
      props = {},
      children = [],
      _owner,
    } = root;
    const elements = [].concat(children).filter(Boolean);

    if (_owner) {
      total = react15TotalNodes(total + 1, _owner);
    }

    for (let i = 0; i < elements.length; i++) {
      total = react15TotalNodes(total + 1, elements[i]);
    }

    total = total + 1;

    return total;
  }

  if (react15) {
    console.log(
      'Total React Nodes',
      react15TotalNodes(0, react15),
    );
  }
};

console.log('%cAuditing... re-run with audit()', 'color: #F53252');
audit();
