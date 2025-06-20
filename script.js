import { foodData } from './data.js';
import { animate } from 'https://esm.run/framer-motion';

document.addEventListener('DOMContentLoaded', () => {
    const accordionContainer = document.getElementById('accordion-container');

    const createDishItem = (dish) => `<li class="text-stone-600">${dish}</li>`;

    const createDishList = (dishes) => `
        <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 pt-4">
            ${dishes.map(createDishItem).join('')}
        </ul>
    `;

    const createSubcategorySection = (subcategory) => `
        <div class="mt-4">
            <h4 class="text-lg font-medium text-green-800 border-b border-green-200 pb-1 mb-3">${subcategory.name}</h4>
            ${createDishList(subcategory.dishes)}
        </div>
    `;

    foodData.forEach(item => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden';

        let contentHtml = '';
        if (item.dishes) {
            contentHtml = createDishList(item.dishes);
        } else if (item.subcategories) {
            contentHtml = item.subcategories.map(createSubcategorySection).join('');
        }

        accordionItem.innerHTML = `
            <button class="accordion-header w-full flex justify-between items-center p-5 text-left transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300">
                <h3 class="text-xl font-semibold text-stone-700">${item.category}</h3>
                <i data-lucide="chevron-down" class="chevron-icon transition-transform duration-300"></i>
            </button>
            <div class="accordion-content h-0 opacity-0 invisible">
                <div class="p-5 pt-0">
                    ${contentHtml}
                </div>
            </div>
        `;
        accordionContainer.appendChild(accordionItem);
    });

    lucide.createIcons();

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content');
            const icon = header.querySelector('.chevron-icon');
            const isOpen = accordionItem.classList.contains('is-open');

            if (isOpen) {
                animate(content, { height: 0, opacity: 0 }, { 
                    duration: 0.4, 
                    ease: "easeOut",
                    onComplete: () => content.classList.add('invisible')
                });
                animate(icon, { rotate: 0 }, { duration: 0.3, ease: "easeOut" });
                accordionItem.classList.remove('is-open');
            } else {
                content.classList.remove('invisible');
                const scrollHeight = content.scrollHeight;
                animate(content, { height: scrollHeight, opacity: 1 }, { duration: 0.4, ease: "easeOut" });
                animate(icon, { rotate: -180 }, { duration: 0.3, ease: "easeOut" });
                accordionItem.classList.add('is-open');
            }
        });
    });
});
