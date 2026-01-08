import BaseNode from "../components/canvas/BaseNode";
import { getNodeDesign } from "./NodeDesigns";

/**
 * The collection of preset node implementations.
 *
 * @param {*} props
 * @returns {*}
 */
const AndNode = (props: any) => (
  <BaseNode
    {...props}
    dynamicHandles={true}
    design={getNodeDesign("andNode")}
    logicFunction={(input) => input.every((value) => value === true)}
    category="gates"
  />
);
const NotNode = (props: any) => (
  <BaseNode
    {...props}
    design={getNodeDesign("notNode")}
    logicFunction={(input) => !input[0]}
    defaultIn={1}
    dynamicHandles={false}
    category="gates"
  />
);

const SourceNode = (props: any) => (
  <BaseNode
    {...props}
    defaultOut={1}
    defaultIn={0}
    design={getNodeDesign("sourceNode")}
    logicFunction={() => Boolean(props.data.value)}
    dynamicHandles={false}
    interactable={true}
    stateful={true}
    category="input"
  />
);

const XorNode = (props: any) => (
  <BaseNode
    {...props}
    design={getNodeDesign("xorNode")}
    logicFunction={(input) =>
      (!input[0] && input[1]) || (input[0] && !input[1])
    }
    defaultIn={2}
    dynamicHandles={false}
    category="gate"
  />
);

const OutputNode = (props: any) => (
  <BaseNode
    {...props}
    design={getNodeDesign("outputNode")}
    logicFunction={(input) => input[0]}
    defaultOut={0}
    defaultIn={1}
    dynamicHandles={false}
    category="output"
  />
);

import CustomNode from "../components/canvas/CustomNode";

export { AndNode, NotNode, SourceNode, XorNode, OutputNode, CustomNode };
