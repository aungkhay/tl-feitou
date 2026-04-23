import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
    state: () => ({
        barTitle: 'Domain',
        isDrawerOpen: 1,
        innerWidth: 0,
        currentRoute: 'domain',
    }),
    actions: {
        setInnerWidth() {
			if(window.innerWidth < 768 && window.innerWidth > 640) {
				this.isDrawerOpen = 2;
				localStorage.setItem('_drawer_', 2);
			} else if(window.innerWidth < 640) {
				this.isDrawerOpen = 0;
				localStorage.setItem('_drawer_', 0);
			} else {
				this.isDrawerOpen = 1;
				localStorage.setItem('_drawer_', 1);
			}
			this.innerWidth = window.innerWidth
		},
        setDrawer() {
			var innerWidth = window.innerWidth;

			if((innerWidth > 768 && this.isDrawerOpen == 1) || (innerWidth < 768 && innerWidth > 640 && this.isDrawerOpen == 1)) {
				this.isDrawerOpen = 2;
			} else if(innerWidth > 768 && this.isDrawerOpen == 2) {
				this.isDrawerOpen = 1;
			} else if(innerWidth < 768 && this.isDrawerOpen == 1){
				this.isDrawerOpen = 0;
			} else {
				this.isDrawerOpen = 1;
			}

			localStorage.setItem('_drawer_', this.isDrawerOpen);
		},
        closeDrawer() {
			this.isDrawerOpen = 0;
		},
        setBarTitle(title) {
			this.barTitle = title;
		},
        setCurrentRoute(route) {
            this.currentRoute = route;
        }
    }
})

