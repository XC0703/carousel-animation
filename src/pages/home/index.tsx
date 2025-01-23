import styles from './index.module.less';

import AvatarCarousel from '@/components/AvatarCarousel';
import BarrageCarousel from '@/components/BarrageCarousel';

const Home = () => {
	return (
		<div className={styles.containerBox}>
			<AvatarCarousel />
			<BarrageCarousel />
		</div>
	);
};

export default Home;
