import BaseNode from "../components/canvas/BaseNode";

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
    design={<div className="rounded-t-xl bg-red-600 w-10 h-7" />}
    logicFunction={(input) => input.every((value) => value === true)}
    category="gates"
  />
);
const NotNode = (props: any) => (
  <BaseNode
    {...props}
    design={<div className="w-5 h-5 flex bg-blue-600" />}
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
    design={<div className="w-7 h-7 flex bg-orange-500 rounded-full" />}
    logicFunction={() => Boolean(props.data.value)}
    dynamicHandles={false}
    interactable={true}
    stateful={true}
    category="input"
  />
);

const TestNode = (props: any) => (
  <BaseNode
    {...props}
    design={<div className="w-9 h-9 bg-cyan-600 flex" />}
    logicFunction={(input) =>
      (!input[0] && input[1]) || (input[0] && !input[1])
    }
    defaultIn={3}
    dynamicHandles={false}
    category="custom"
  />
);

export { AndNode, NotNode, SourceNode, TestNode };
