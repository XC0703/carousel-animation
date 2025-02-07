/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

import styles from './index.module.less';

// const PARENT_WIDTH = 400; // 弹幕容器宽度，单位px
const BARRAGE_SPEED = 80; // 弹幕速度（px/s）

interface BarrageItemDTO {
	content: string;
	id: string;
}

const BarrageCarousel = () => {
	const barrageList: BarrageItemDTO[] = [
		{ content: '弹幕111', id: '1' },
		{ content: '弹幕22222', id: '2' },
		{ content: '弹幕33333', id: '3' },
		{ content: '弹幕4444444', id: '4' },
		{ content: '弹幕555555', id: '5' },
		{ content: '弹幕666666666666666666666666666', id: '6' },
		{ content: '弹幕7777777777777', id: '7' },
		{ content: '弹幕8', id: '8' }
	];
	const speed = BARRAGE_SPEED; // 弹幕速度，单位px/s

	const BarrageListContainerRef = useRef<HTMLDivElement>(null); // 弹幕容器,用于获取宽度
	const destoryRef = useRef(false); // 是否销毁
	const moveBarPreRef = useRef<HTMLDivElement>(null); // 前一个容器
	const moveBarNextRef = useRef<HTMLDivElement>(null); // 后一个容器

	// 弹幕数量不足，重复弹幕，确保展示的弹幕能够超过容器宽度（必须满足，否则时间会有问题）
	// 只会导致key重复，不会有其他问题
	const handleBarrage = (barrageArray: BarrageItemDTO[]) => {
		if (barrageArray.length < 8) {
			const tempArray = [...barrageArray];
			while (tempArray.length < 8) {
				tempArray.push(...barrageArray);
			}
			return tempArray;
		} else {
			return barrageArray;
		}
	};
	const barrageArrayData =
		!barrageList || barrageList.length === 0 ? [] : handleBarrage(barrageList);

	// 弹幕列
	const BarrageRow = (props: { barrageRowData: BarrageItemDTO[]; rowIndex: number }) => {
		const { barrageRowData, rowIndex } = props;
		return (
			<>
				{barrageRowData.map(item => {
					return (
						<div className={styles.barrageItem} key={`${item.id}-${rowIndex}`}>
							{item.content}
						</div>
					);
				})}
			</>
		);
	};

	// 实现弹幕滚动的原理：设置一前一后两个容器，前一个容器显示完后，后一个容器开始显示，同时前一个容器重置位置
	// useEffect(() => {
	// 	initAnimate();
	// 	return () => {
	// 		destoryRef.current = true;
	// 	};
	// }, []);

	// 动画初始化
	const initAnimate = () => {
		const BarrageListContainerWidth = (BarrageListContainerRef.current?.offsetWidth as number) || 0;
		const preOffset = (moveBarPreRef.current?.offsetWidth as number) || 0;
		const nextOffset = (moveBarNextRef.current?.offsetWidth as number) || 0;

		if (destoryRef.current) {
			return;
		}

		// 计算前一个容器的移动时间，*1000是为了转换成ms
		const preMoveTime = (preOffset * 1000) / speed;
		// 设置前一个容器的移动时间和移动距离，实现移动动画
		if (moveBarPreRef?.current?.style) {
			moveBarPreRef.current.style.transition = `all ${preMoveTime}ms linear`;
			moveBarPreRef.current.style.transform = `translateX(-${preOffset}px)`;
		}
		// 动画完成自动reset
		setTimeout(() => {
			moveReset(moveBarPreRef);
		}, preMoveTime + 50);

		// 前一个容器的宽度大于容器宽度，需要等待一段时间再移动，使其完全进入视线
		const waitTime = ((preOffset - BarrageListContainerWidth) * 1000) / speed;

		setTimeout(() => {
			// 计算后一个容器的移动时间，*1000是为了转换成ms
			const nextMoveTime = ((nextOffset + BarrageListContainerWidth) * 1000) / speed;
			// 设置后一个容器的移动时间和移动距离，实现移动动画
			if (moveBarNextRef?.current?.style) {
				moveBarNextRef.current.style.transition = `all ${nextMoveTime}ms linear`;
				moveBarNextRef.current.style.transform = `translateX(-${nextOffset}px)`;
			}
			// 动画完成自动reset
			setTimeout(() => {
				moveReset(moveBarNextRef);
			}, nextMoveTime + 50);

			// 当后一个容器已经完全进入视线时，前一个容器及时开启动画（此时前一个容器已经reset）
			setTimeout(
				() => {
					moveAction(moveBarPreRef, moveBarNextRef);
				},
				(nextOffset * 1000) / speed
			);
		}, waitTime);
	};

	// 重置已经移动结束的容器，凭借到容器最右侧等待下一次移动
	const moveReset = (tRef: any) => {
		if (destoryRef.current) {
			return;
		}
		const BarrageListContainerWidth = (BarrageListContainerRef.current?.offsetWidth as number) || 0;
		const element = tRef.current;
		if (!element) return;
		element.style.transition = '';
		element.style.transform = `translateX(${BarrageListContainerWidth}px)`; // 记得使用px单位
	};

	// 循环移动
	const moveAction = (tRef: any, nRef: any) => {
		if (destoryRef.current) {
			return;
		}
		// 开启第二次循环动画
		const tElement = tRef.current;
		const BarrageListContainerWidth = (BarrageListContainerRef.current?.offsetWidth as number) || 0;
		const nowOffset = (tElement?.offsetWidth as number) || 0;
		const moveTime = ((nowOffset + BarrageListContainerWidth) * 1000) / speed;
		tElement.style.transition = `all ${moveTime}ms linear`;
		tElement.style.transform = `translateX(-${nowOffset}px)`;

		setTimeout(() => {
			moveReset(tRef);
		}, moveTime + 50);

		// 递归调用，实现无限循环
		setTimeout(
			() => {
				moveAction(nRef, tRef);
			},
			(nowOffset * 1000) / speed
		);
	};

	return (
		<div className={styles.barrageCarouselContainer}>
			<h3>弹幕轮播动画</h3>
			<div className={styles.BarrageListContainer} ref={BarrageListContainerRef}>
				<div
					className={styles.barrageRow}
					ref={moveBarPreRef}
					// style={{
					// 	transform: `translateX(${0}px)`
					// }}
				>
					<BarrageRow barrageRowData={barrageArrayData} rowIndex={0} />
				</div>
				<div
					className={styles.barrageRow}
					ref={moveBarNextRef}
					// style={{
					// 	transform: `translateX(${PARENT_WIDTH}px)`
					// }}
				>
					<BarrageRow barrageRowData={barrageArrayData} rowIndex={1} />
				</div>
			</div>
		</div>
	);
};

export default BarrageCarousel;
