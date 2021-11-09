from convlab2.nlu.jointBERT.crosswoz import BERTNLU
from convlab2.dst.rule.crosswoz.dst import RuleDST
from convlab2.policy.mle.crosswoz.mle import MLE
from convlab2.nlg.sclstm.crosswoz.sc_lstm import SCLSTM
from copy import deepcopy
from pprint import pprint


class Pipeline():
    def __init__(self):
        # BERT nlu
        self.nlu = BERTNLU()
        # simple rule DST
        self.dst = RuleDST()
        # rule policy
        self.policy = MLE()
        # template NLG
        self.nlg = SCLSTM(is_user=False, use_cuda=False)


    def reply(self, utterance, current_state = None):
        """
        input: 
        - utterance: (str)
        - current_state: (object)
        output: 
        - reply_utterance: (str)
        - next_state: (object)
        - recommend: [{domain-name}(str), ]
        - select: {domain-name}(str)
        - taxi: {'出发地': (str), '目的地':(str)'}
        - hotel: (str)
        - site: (str)
        - restaurant:(str)
        """
        # get context
        context = [x[1] for x in current_state['history'][:-1]] if current_state else []
        # get reply utterance
        input_action = self.nlu.predict(utterance, context)
        self.dst.init_session(current_state)
        self.dst.update(input_action)
        self.dst.state['user_action'] = input_action
        output_action = self.policy.predict(self.dst.state)
        reply_utterance = self.nlg.generate(output_action)

        # store history
        self.dst.state['history'].append(['usr', utterance])
        self.dst.state['history'].append(['sys', reply_utterance])
        # get data
        next_state = deepcopy(self.dst.state)
        recommend = []
        select = []
        if current_state:
            taxi = True if next_state['belief_state']['出租'] != current_state['belief_state']['出租'] else False
            if taxi:
                if next_state['belief_state']['出租']['出发地'] != "" and next_state['belief_state']['出租']['目的地'] != "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，出發地為{next_state['belief_state']['出租']['出发地']}，目的地為{next_state['belief_state']['出租']['目的地']}。"
                elif next_state['belief_state']['出租']['出发地'] == "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，目的地為{next_state['belief_state']['出租']['目的地']}。"
                elif next_state['belief_state']['出租']['目的地'] == "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，目的地為{next_state['belief_state']['出租']['出发地']}。"
            hotel = True if next_state['belief_state']['酒店']['名称']  != current_state['belief_state']['酒店']['名称'] else False
            site = True if next_state['belief_state']['景点']['名称']  != current_state['belief_state']['景点']['名称'] else False
            restaurant = True if next_state['belief_state']['餐馆']['名称']  != current_state['belief_state']['餐馆']['名称'] else False
        else:
            taxi = True if next_state['belief_state']['出租'] != {'出发地':"", '目的地':""} else False
            if taxi:
                if next_state['belief_state']['出租']['出发地'] != "" and next_state['belief_state']['出租']['目的地'] != "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，出發地為{next_state['belief_state']['出租']['出发地']}，目的地為{next_state['belief_state']['出租']['目的地']}。"
                elif next_state['belief_state']['出租']['出发地'] == "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，目的地為{next_state['belief_state']['出租']['目的地']}。"
                elif next_state['belief_state']['出租']['目的地'] == "":
                    reply_utterance = f"好的，即將為您導向一個計程車網站，出發地為{next_state['belief_state']['出租']['出发地']}。"
      
            hotel = True if next_state['belief_state']['酒店']['名称']  != "" else False
            site = True if next_state['belief_state']['景点']['名称']  != "" else False
            restaurant = True if next_state['belief_state']['餐馆']['名称']  != "" else False
        # usr_action
        for da in input_action:
            if da[0] == "Inform":
                if da[2] == '名称':
                    insert_item = {}
                    insert_item['domain'] = da[1]
                    insert_item['name'] = da[3]
                    select.append(insert_item)
        # sys_action
        for da in output_action:
            if da[0] == "Recommend":
                if da[2] == '名称':
                    insert_item = {}
                    insert_item['domain'] = da[1]
                    insert_item['name'] = da[3]
                    recommend.append(insert_item)

        return reply_utterance, next_state, recommend, select, taxi, hotel, site, restaurant


if __name__ == '__main__':
    pipeline = Pipeline()
    current_state = None
    reply_utterance, next_state, recommend, select, taxi, hotel, site, restaurant = pipeline.reply(utterance, current_state = current_state)
    print("reply_utterance:", reply_utterance)
    print("next_state:")
    pprint(next_state)
    print("recommend:", recommend)
    print("select:", select)
    print("taxi:", taxi)
    print("hotel:", hotel)
    print("site:", site)
    print("restaurant:", restaurant)


    


