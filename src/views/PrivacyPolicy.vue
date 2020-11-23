<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <h1 :class="headingsMode">
            {{ title }}
          </h1>
          <div v-for="content in contents" :key="content.id">
            <h2 :class="headingsMode">
              {{ content.subtitle }}
            </h2>
            <p>
              {{ content.subcontent }}
            </p>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class PrivacyPolicy extends BaseComponent {
  get headingsMode() {
    return this.darkMode ? "headings-dark" : "headings-light";
  }

  get title() {
    return "PRIVACY POLICY";
  }

  get contents() {
    return [
      {
        id: 1,
        subtitle: "About Us",
        subcontent:
          "The Bancor Network (the “Bancor Network”, “We”, “Us” or “Our”) is a Decentralized Liquidity Network that allows you to hold any Ethereum token and convert it to any other token in the network, with no counter party, at an automatically calculated price, using a simple web wallet (the “Services”). This privacy policy has been created to inform about how we manage, collect, store and use the personal information we receive and collect in connection with the Bancor Network (the Policy)."
      },
      {
        id: 2,
        subtitle: "Acceptance of Policy",
        subcontent:
          "Our registration process is done by using a chatbot. As such, we create a conversation process where we ask you to agree to the terms of Our Privacy Policy, by replying “yes” you agree that you have read, understood, accept and agree to be bound by this Privacy Policy. If you don’t agree with the Privacy Policy, please do not use our Services."
      },
      {
        id: 3,
        subtitle: "Changes to Our Privacy Policy",
        subcontent:
          "We may update this Privacy Policy to reflect changes to our information collection, usage and storage practices. If we make any changes that we deem as “material” (in our sole good faith discretion), we will notify you (using the notification methods set forth in the “Notices” Section prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices."
      },
      {
        id: 4,
        subtitle: "Information we collect and for which purposes",
        subcontent:
          "We collect information that is necessary for the functioning of our Bancor Netwotk and the provision of Services through it. We receive the Information, such as username directly from you when you register to our Bancor Network as member of a community. You may voluntarily provide us your contact information and related data, including personal information. We use the information in order to administer our Network and for internal operations, including troubleshooting, data analysis, testing, research, statistical and survey purposes. We may also store information that your computer or mobile device provides us in connection with your use of the Service, such as your browser type, type of computer or mobile device, browser language, IP address. If you register to the Bancor Network using a third party Service like Facebook, we may receive information about you from such third party Service."
      },
      {
        id: 5,
        subtitle: "Disclosure of Your Information",
        subcontent:
          "We do not rent or sell any information about you to others, or trade any such information. We may employ third party companies and individuals to facilitate the operation of the Network, and to perform services related to administration of the Network (including, but not limited to, bill and credit card payment processing, maintenance, hosting and database management services, web analytics and administration). You understand and agree that we may be required to disclose personal information if required to do so by law or in the belief that such disclosure is reasonably necessary to avoid liability, to comply with legal process, including, but not limited to a subpoena, statute, search warrant, or court order, or to protect our, or a third party, property and rights, to protect the safety of the public or any person, or to prevent or stop activity we may consider to be, or to pose a risk of being, illegal, unethical or legally actionable. In the event we will be acquired by or merged with a third party entity, or in the event of bankruptcy or a comparable event, We reserve the right to transfer or assign personal information in connection with the foregoing events."
      },
      {
        id: 6,
        subtitle: "Cookies Statement",
        subcontent: `We use cookies. Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site. Cookies are typically stored on your computer's hard drive. Information collected from cookies is used by us to evaluate the effectiveness of our website and API located at https://bancor.network, and any linked or directed subdomain (such as https://app.bancor.network) (the “Site”), analyze trends, and manage the platform. The information collected from cookies allows us to determine such things as which parts of our Site are most visited and difficulties our visitors may experience in accessing our Site. With this knowledge, we can improve the quality of your experience on the platform by recognizing and delivering more of the most desired features and information, as well as by resolving access difficulties. We also use cookies and/or a technology known as web bugs or clear gifs, which are typically stored in emails to help us confirm your receipt of, and response to, our emails and to provide you with a more personalized experience when using our Site. We also use third party service provider(s), to assist us in better understanding the use of our Site. Our service provider(s) will place cookies on the hard drive of your computer and will receive information that we select that will educate us on such things as how visitors navigate around our site, what pages are browsed and general transaction information. Our service provider(s) analyses this information and provides us with aggregate reports. The information and analysis provided by our service provider(s) will be used to assist us in better understanding our visitors' interests in our Site and how to better serve those interests. The information collected by our service provider(s) may be linked to and combined with information that we collect about you while you are using the platform. Our service provider(s) is/are contractually restricted from using information they receive from our Site other than to assist us. Your continued use of our Site, as well as any subsequent usage, will be interpreted as your consent to cookies being stored on your device.`
      },
      {
        id: 7,
        subtitle: "Security",
        subcontent:
          "Everything We save is encrypted and We have implemented the technical and organizational measures designed to secure your information from accidental loss and from unauthorized access, use, alteration or disclosure. However, we cannot guarantee that unauthorized third parties will never be able to overcome those measures or use your information for improper purposes."
      },
      {
        id: 8,
        subtitle: "Processing and transferring your information",
        subcontent:
          "The information provided will be saved and stored with the hosting and information backup providers (such as Google Cloud) in the U.S, held and operated by third parties other than Bancor and/or which are not controlled by Bancor. Upon providing the information the site visitor agrees and confirms that Bancor may transfer to and/or save the information provided thereto on servers located in the U.S."
      },
      {
        id: 9,
        subtitle: "Your Rights",
        subcontent:
          "You may review, update, or delete the information collected by or through our Service by logging into your account and reviewing your account settings and profile. You have a right to access to your personal information held by us by requesting a copy in writing. We will provide you with such copy as soon as practicable after receiving a valid request. We may charge you a fee, which shall not exceed the cost for copies. We may request proof of identification to verify your access request and reject any unfair request. To exercise this right, please refer to the “Contact Us” section below."
      },
      {
        id: 10,
        subtitle: "Notices",
        subcontent:
          "Notices to you may be made via our website. Bancor may also provide notices of changes to this Privacy Policy or other matters by displaying notices or links to notices to you generally on our website. You agree that all agreements, notices, disclosures and any other communications that Bancor provide as aforementioned satisfy any legal requirement that such communications be in writing."
      },
      {
        id: 11,
        subtitle: "Contact Us",
        subcontent:
          "For any questions about this Privacy Policy or any other issue regarding the Bacnor Network or our Services please contact us at: privacy@bancor.network"
      }
    ];
  }
}
</script>

<style lang="scss"></style>
