import { useEffect, useRef, useState } from 'react';

import styles from './index.module.less';

const AvatarCarousel = () => {
	const [avatarList, setAvatarList] = useState<string[]>([
		'https://img.alicdn.com/bao/uploaded/i2/O1CN01TEnjbR1jxGQKMfnG3_!!0-mtopupload.jpg',
		'https://img.alicdn.com/bao/uploaded/i4/O1CN01au1IiC2GwhHQRo1M8_!!0-mtopupload.jpg',
		'https://img.alicdn.com/bao/uploaded/i4/O1CN01BeSG5i1mUMJCJvXAx_!!4611686018427385981-0-mtopupload.jpg',
		'https://gtms03.alicdn.com/tps/i3/TB1LFGeKVXXXXbCaXXX07tlTXXX-200-200.png',
		'https://img.alicdn.com/bao/uploaded/i3/O1CN01v4wLrP1P7h7r8BMwe_!!0-fleamarket.jpg'
	]);
	const [avatarClass, setAvatarClass] = useState<string[]>([
		'fadeInAvatar',
		'firstAvatar',
		'secondAvatar',
		'thirdAvatar',
		'fadeOutAvatar'
	]);
	const avatarRefs = useRef<Array<HTMLImageElement | null>>([]);
	const avatarTimerRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		// 头像轮播思路：动态改变类名，触发对应类名的css动画
		// avatarList的最前面添加最后一个元素，最后面添加第一个元素，方便轮播
		const tempAvatarList = (avatarList as string[]) || [];
		// 如果头像数量小于5，则用兜底图填充
		if (tempAvatarList.length < 5) {
			const avatarsNeeded = 5 - tempAvatarList.length;
			for (let i = 0; i < avatarsNeeded; i++) {
				tempAvatarList.push(
					'https://gtms03.alicdn.com/tps/i3/TB1LFGeKVXXXXbCaXXX07tlTXXX-200-200.png'
				);
			}
		}
		setAvatarList([...tempAvatarList]);
		// 轮播动画，将第一个类名移动到最后一个
		const next = () => {
			setAvatarClass(prevAvatarClass => {
				if (prevAvatarClass.length > 0) {
					return [...prevAvatarClass.slice(1), prevAvatarClass[0]];
				}
				return prevAvatarClass;
			});
		};
		avatarTimerRef.current = setInterval(next, 1600);
		// 组件销毁时清除定时器
		return () => clearInterval(avatarTimerRef.current);
		return undefined;
	}, []);

	return (
		<div className={styles.avatarCarouselContainer}>
			<h3>头像轮播动画</h3>
			<div className={styles.avatarList}>
				{avatarList.map((item, index) => (
					<img
						key={item}
						src={item}
						ref={(ref: HTMLImageElement | null) => {
							avatarRefs.current[index] = ref;
						}}
						className={`${styles.avatar} ${styles[avatarClass[index]]}`}
					/>
				))}
			</div>
		</div>
	);
};

export default AvatarCarousel;
