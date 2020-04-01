/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Builder from '../../Builder';
import {Tokens, space, indent, flatten, operator} from '../../tokens';
import {JSXElement, jsxElement, AnyNode} from '@romejs/js-ast';

export default function JSXElement(builder: Builder, node: AnyNode): Tokens {
  node = jsxElement.assert(node);

  let tokens: Tokens = [
    operator('<'),
    ...builder.print(node.name, node),
    ...builder.print(node.typeArguments, node),
  ];

  if (node.attributes.length > 0) {
    tokens = [
      ...tokens,
      space,
      builder.printJoin(node.attributes, node, {
        newline: true,
        broken: {},
        unbroken: {
          separator: [space],
        },
      }),
    ];
  }

  if (node.selfClosing === true) {
    return [...tokens, space, operator('/>')];
  } else {
    return [
      ...tokens,
      operator('>'),
      indent(flatten(node.children.map((child) => builder.print(child, node)))),

      operator('</'),
      ...builder.print(node.name, node),
      operator('>'),
    ];
  }
}