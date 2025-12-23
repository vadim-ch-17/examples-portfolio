import { ServiceFragment } from '../../setup/apollo/fragments/operationTypes/ServiceFragment';
import { StorageFragment } from '../../setup/apollo/fragments/operationTypes/StorageFragment';
import {
  GetPage_socialLinks,
  GetPage_contactForm,
  GetPage_contactInfo,
  GetPage_space,
} from '../pages/CmsPage/operationTypes/GetPage';
import { Sections } from '../pages/CmsPage/types';

export interface SectionsProps {
  sections: Sections;
  services: ServiceFragment[];
  storages: StorageFragment[];
  socialLinks: GetPage_socialLinks | null;
  contactForm: GetPage_contactForm | null;
  contactInfo: GetPage_contactInfo | null;
  space: GetPage_space[] | null;
}

export type SpacingType = {
  mobile: string;
  desktop: string;
};

export interface SectionSpacing {
  top: SpacingType;
  bottom: SpacingType;
}

export interface SectionSpacingApi {
  top: string;
  bottom: string;
}
