import ReactReconciler from 'react-reconciler';
// const CustomRenderer = require('./reconciler'); // 写入word用
// const hostConfig = {};
// const hostConfig = {
// 	now: Date.now,
// 	getRootHostContext: () => {},
// 	prepareForCommit: () => {},
// 	resetAfterCommit: () => {},
// 	getChildHostContext: () => {},
// 	shouldSetTextContent: () => {},
// 	createInstance: () => {},
// 	createTextInstance: () => {},
// 	appendInitialChild: () => {},
// 	finalizeInitialChildren: () => {},
// };

const rootHostContext = {};
const childHostContext = {};
const hostConfig = {
	now: Date.now,
	// hostContext
	// 宿主上下文是一个内部对象，我们的渲染器可以根据树中的位置使用它。在 DOM 中，这个对象需要被正确调用，例如根据当前上下文在 html 或 MathMl 中创建元素。
	getRootHostContext: () => {
		return rootHostContext;
	},
	prepareForCommit: () => {},
	resetAfterCommit: () => {},
	getChildHostContext: () => {
		return childHostContext;
	},
	// 如果它返回 false，重置文本内容。
	shouldSetTextContent: (type, props) => {
		return (
			typeof props.children === 'string' ||
			typeof props.children === 'number'
		);
	},
	/**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
	createInstance: (
		type,
		newProps,
		rootContainerInstance,
		_currentHostContext,
		workInProgress
	) => {
		// console.log('type: ', type);
		// console.log('newProps: ', newProps);
		// console.log('workInProgress: ', workInProgress);
		const domElement = document.createElement(type);
		Object.keys(newProps).forEach(propName => {
			const propValue = newProps[propName];
			if (propName === 'children') {
				if (
					typeof propValue === 'string' ||
					typeof propValue === 'number'
				) {
					domElement.textContent = propValue;
				}
			} else if (propName === 'onClick') {
				domElement.addEventListener('click', propValue);
			} else if (propName === 'className') {
				domElement.setAttribute('class', propValue);
			} else {
				const propValue = newProps[propName];
				domElement.setAttribute(propName, propValue);
			}
		});
		return domElement;
	},
	createTextInstance: text => {
		return document.createTextNode(text);
	},
	appendInitialChild: (parent, child) => {
		parent.appendChild(child);
	},
	appendChild(parent, child) {
		parent.appendChild(child);
	},
	finalizeInitialChildren: (domElement, type, props) => {},
	supportsMutation: true,
	// 如果 Fiber 的类型是 HostRoot 或 HostPortal，则将子节点添加到该容器中。
	appendChildToContainer: (parent, child) => {
		parent.appendChild(child);
	},
	// 它计算实例的差异。即使 Fiber 暂停或中止对树的部分渲染，也可以重用这项工作。
	prepareUpdate(domElement, oldProps, newProps) {
		return true;
	},
	// 提交更新或将计算的差异应用到宿主环境的节点 (WordDocument)。
	commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
		Object.keys(newProps).forEach(propName => {
			const propValue = newProps[propName];
			if (propName === 'children') {
				if (
					typeof propValue === 'string' ||
					typeof propValue === 'number'
				) {
					domElement.textContent = propValue;
				}
			} else {
				const propValue = newProps[propName];
				domElement.setAttribute(propName, propValue);
			}
		});
	},
	// 与 commitUpdate 类似，但它为文本节点提交更新内容。
	commitTextUpdate(textInstance, oldText, newText) {
		textInstance.text = newText;
	},
	// 从树中移除节点。如果返回的 Fiber 是容器，那么我们使用 removeChildFromContainer 从容器中删除节点，否则我们使用 removeChild。
	removeChild(parentInstance, child) {
		parentInstance.removeChild(child);
	},
};

const ReactReconcilerInst = ReactReconciler(hostConfig);
// const ReactReconcilerInst = CustomRenderer;
export default {
	render: (reactElement, domElement, callback) => {
		console.log('reactElement: ', reactElement);
		console.log('domElement: ', domElement);
		console.log('callback: ', callback);
		ReactReconcilerInst.injectIntoDevTools({
			bundleType: 1, // 0 for PROD, 1 for DEV
			version: '0.1.0', // version for your renderer
			rendererPackageName: 'custom-renderer', // package name
			findHostInstanceByFiber: ReactReconcilerInst.findHostInstance, // host instance (root)
		});
		// console.log(arguments);
		// Create a root Container if it doesnt exist
		if (!domElement._rootContainer) {
			domElement._rootContainer = ReactReconcilerInst.createContainer(
				domElement,
				false
			);
		}

		// update the root Container
		return ReactReconcilerInst.updateContainer(
			reactElement,
			domElement._rootContainer,
			null,
			callback
		);
	},
};
