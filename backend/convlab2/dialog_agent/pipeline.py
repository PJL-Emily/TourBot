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
        print("%%%")
        print(context)
        print("%%%")
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
            taxi = next_state['belief_state']['出租'] if next_state['belief_state']['出租'] != current_state['belief_state']['出租'] else {'出发地': '', '目的地': ''}
            if taxi != {'出发地': '', '目的地': ''}:
                reply_utterance = f"好的，即將為您導向一個出租車網站，出發地為{taxi['出发地']}，目的地為{taxi['目的地']}。"
            hotel = next_state['belief_state']['酒店']['名称'] if next_state['belief_state']['酒店']['名称']  != current_state['belief_state']['酒店']['名称'] else ""
            site = next_state['belief_state']['景点']['名称'] if next_state['belief_state']['景点']['名称']  != current_state['belief_state']['景点']['名称'] else ""
            restaurant = next_state['belief_state']['餐馆']['名称'] if next_state['belief_state']['餐馆']['名称']  != current_state['belief_state']['餐馆']['名称'] else ""
        else:
            taxi =  {'出发地': '', '目的地': ''}
            hotel = ""
            site = ""
            restaurant = ""
        # usr_action
        for da in input_action:
            if da[0] == "Inform":
                if da[2] == '名称':
                    select.append(f'{da[1]}-{da[3]}')
        # sys_action
        for da in output_action:
            if da[0] == "Recommend":
                if da[2] == '名称':
                    recommend.append(f'{da[1]}-{da[3]}')

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


    


