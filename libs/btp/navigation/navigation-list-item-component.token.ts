import { FocusableOption } from '@angular/cdk/a11y';
import { DomPortal } from '@angular/cdk/portal';
import { ElementRef, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Nullable, RtlService } from '@fundamental-ngx/cdk/utils';
import { BasePopoverClass, PopoverService } from '@fundamental-ngx/core/popover';
import { filter } from 'rxjs';
import { FdbNavigationComponent } from './navigation-component.token';
import { FdbNavigationListComponent } from './navigation-list-component.token';

export abstract class FdbNavigationListItemComponent extends BasePopoverClass implements FocusableOption {
    abstract elementRef: ElementRef<HTMLElement>;
    abstract expanded: WritableSignal<boolean>;
    abstract expandedAttr: Signal<boolean>;
    abstract fullPathExpanded: Signal<boolean>;
    abstract _isInPopover: Signal<boolean>;
    abstract inPortal: Signal<boolean>;
    abstract childNavigationListComponent: Signal<FdbNavigationListComponent | null>;
    abstract isGroup: Signal<boolean>;
    abstract level: Signal<number>;
    abstract routerLinkActive: Signal<RouterLinkActive | null>;
    abstract parentListItemComponent: FdbNavigationListItemComponent | null;
    abstract alwaysFocusable: boolean;
    abstract domPortal: Nullable<DomPortal>;
    abstract focusOnClonedLink(): void;
    abstract expand(): void;
    abstract collapse(): void;
    abstract toggle(): void;
    abstract setSnappedActiveState(isActive: boolean): void;
    abstract focus(): void;
    abstract hide(): void;
    abstract show(): void;
    abstract calculateExpanded(): void;
    abstract checkSelfHidden(): void;
    abstract createPortal(): DomPortal;
    abstract destroyPortal(): void;

    /** @hidden */
    _hidden = signal(false);

    /** @hidden */
    hiddenItems = signal<FdbNavigationListItemComponent[]>([]);

    /** @hidden */
    navigationComponent = inject(FdbNavigationComponent);

    /** @hidden */
    hasPortalChildren = signal(false);

    /** @hidden */
    childFocused = signal(false);

    /** @hidden */
    parentNavigationListComponent = inject(FdbNavigationListComponent);

    /** @hidden */
    private _listenToSnappedExpandedState = true;

    /** @hidden */
    protected readonly _rtl = inject(RtlService, { optional: true });

    /** @hidden */
    protected readonly _popoverService = inject(PopoverService);

    /** @hidden */
    constructor() {
        super();
        this._rtl?.rtl.subscribe((isRtl) => {
            this.placement = isRtl ? 'left-start' : 'right-start';
            this._popoverService.refreshConfiguration(this);
        });

        effect(() => {
            this.isOpen = this.expanded();
        });

        effect(() => {
            const hasChildren = this.childNavigationListComponent() || this.hasPortalChildren();
            const isSnapped = this.navigationComponent.isSnapped();
            const shouldDisable = !isSnapped || !hasChildren || this._hidden();
            this._listenToSnappedExpandedState = true;
            this._popoverService.setIgnoreTriggers(shouldDisable);
            this._popoverService.disabled = shouldDisable;
        });

        effect(
            () => {
                if (!this._listenToSnappedExpandedState && !this._hidden()) {
                    return;
                }
                if (this.navigationComponent.isSnapped() && this.expanded() && this.parentListItemComponent) {
                    this.expanded.set(false);
                    this.isOpen = false;
                    this._popoverService.refreshConfiguration(this);
                    this._listenToSnappedExpandedState = false;
                }
            },
            {
                allowSignalWrites: true
            }
        );

        effect(() => {
            const activeRouterLink = this.routerLinkActive();
            activeRouterLink?.isActiveChange.subscribe((isActive) => {
                this.parentListItemComponent?.setSnappedActiveState(isActive);
            });
        });

        this.isOpenChange.pipe(filter(() => this.navigationComponent.isSnapped())).subscribe((isOpen) => {
            this.isOpen = isOpen;
            this.expanded.set(isOpen);
            if (!this.isOpen) {
                this.focus();
            }
        });
    }
}
