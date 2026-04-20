import { useReactFlow } from "@xyflow/react";
import { useEffect, useRef } from "react";
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
    delay={1000}
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

const ClockNode = (props: any) => {
  const { updateNodeData } = useReactFlow();
  const periodMs = 1000;
  const valueRef = useRef(Boolean(props.data?.value));
  const nextToggleAtRef = useRef<number | null>(
    Number.isFinite(Number(props.data?.nextToggleAt))
      ? Number(props.data?.nextToggleAt)
      : null,
  );

  const getPhaseOffsetMs = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++)
      hash = (hash * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(hash) % periodMs;
  };

  useEffect(() => {
    valueRef.current = Boolean(props.data?.value);
  }, [props.data?.value]);

  useEffect(() => {
    const parsed = Number(props.data?.nextToggleAt);
    if (Number.isFinite(parsed)) nextToggleAtRef.current = parsed;
  }, [props.data?.nextToggleAt]);

  useEffect(() => {
    const now = Date.now();
    const fallbackPhaseOffset = getPhaseOffsetMs(String(props.id));

    if (nextToggleAtRef.current === null) {
      nextToggleAtRef.current =
        now + (periodMs - fallbackPhaseOffset || periodMs);
      updateNodeData(props.id, { nextToggleAt: nextToggleAtRef.current });
    }

    const currentNextToggleAt = nextToggleAtRef.current;
    if (currentNextToggleAt === null) return;

    if (now >= currentNextToggleAt) {
      const elapsedPeriods =
        Math.floor((now - currentNextToggleAt) / periodMs) + 1;
      const shouldFlip = elapsedPeriods % 2 === 1;
      const nextValue = shouldFlip ? !valueRef.current : valueRef.current;
      const advancedNextToggleAt =
        currentNextToggleAt + elapsedPeriods * periodMs;

      valueRef.current = nextValue;
      nextToggleAtRef.current = advancedNextToggleAt;
      updateNodeData(props.id, {
        value: nextValue,
        nextToggleAt: advancedNextToggleAt,
      });
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;

    const scheduleNextTick = () => {
      if (!isActive || nextToggleAtRef.current === null) return;

      const delayMs = Math.max(0, nextToggleAtRef.current - Date.now());
      timeoutId = setTimeout(() => {
        if (!isActive || nextToggleAtRef.current === null) return;

        const nextValue = !valueRef.current;
        const advancedNextToggleAt = nextToggleAtRef.current + periodMs;

        valueRef.current = nextValue;
        nextToggleAtRef.current = advancedNextToggleAt;
        updateNodeData(props.id, {
          value: nextValue,
          nextToggleAt: advancedNextToggleAt,
        });

        scheduleNextTick();
      }, delayMs);
    };

    scheduleNextTick();

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [periodMs, props.id, updateNodeData]);

  return (
    <BaseNode
      {...props}
      design={getNodeDesign("clockNode")}
      logicFunction={() => Boolean(props.data?.value)}
      defaultIn={0}
      dynamicHandles={false}
      category="sequential"
    />
  );
};

import CustomNode from "../components/canvas/CustomNode";

export {
  AndNode,
  NotNode,
  SourceNode,
  XorNode,
  OutputNode,
  CustomNode,
  ClockNode,
};
